import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonSlides, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { AuthenticationService } from '../servicios/authentication.service';
import { MatchService } from '../servicios/match.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

declare var google: any;

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.page.html',
  styleUrls: ['./show-product.page.scss'],
})
export class ShowProductPage implements OnInit {

  @Input() producto: any;
  slideOpts = {
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      dynamicBullets: true,
      dynamicMainBullets: 1,
      clickable: true,
      renderBullet: function (index) {
        return '<span class="swiper-pagination-bullet swiper-pagination-bullet-active-main custom-bullets">' + (index + 1) + '</span>';
      }
    },
  }

  @ViewChild('sliderRef', { static: true }) protected slides: IonSlides;
  @ViewChild('map', { static: true }) protected map: ElementRef;


  constructor(    
    private productosService: ProductosService,
    private authService: AuthenticationService,
    private smartAudio: SmartAudioService,
    private matchService: MatchService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ionViewDidEnter() {
    this.slides.update();
  }

  ngOnInit() {    
    this.crearMapa();
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }

  crearMapa() {
    var map = new google.maps.Map(this.map.nativeElement, {
      center: {lat: this.producto.address.latitude, lng: this.producto.address.longitude}, 
      zoom: 10,      
      mapTypeControl: false,
      zoomControl: true,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    var marker = new google.maps.Marker({
      position: {lat: this.producto.address.latitude, lng: this.producto.address.longitude},
      map: map,            
      label: {        
        color: "#ff5f90",
        fontSize: "16px",
        fontWeight: 'bold',
        text: this.producto.name
      },
      icon: '../../assets/icon/marker.png',
    });
  }

  closeModal(){
    this.playSound();
    this.modalCtrl.dismiss();
  }

  async openShared(){
    this.playSound();
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Compartir en:',
      buttons: [
        {
          icon: "logo-whatsapp",
          text: 'Whatsapp',          
        },
        {
          icon: "logo-facebook",
          text: 'Facebook',
        },
        {
          icon: "logo-twitter",
          text: 'Twitter',          
        },
        {
          icon: "logo-instagram",
          text: 'Instagram',
        },
        {
          icon: "close",
          text: 'Cancelar',
          role: 'cancel',
        },
      ]
    });

    actionSheet.present();
  }  

  addToFavorite() {
    this.playSound();
    this.productosService.addFavoriteProduct(this.producto.id).then(response => {      
      this.presentToast(this.producto.name + ' ha sido añadido a favoritos.', 'success');
      this.producto.is_favorite = true;
      this.producto.favorite_to_count++;
    }).catch(error => {
      this.presentToast(error.error.errors.property_id[0], 'danger');
    });
  }

  removeFromFavorite() {
    this.playSound();    
    this.productosService.removeFavoriteProduct(this.producto.id).then(response => {
      this.presentToast(this.producto.name + ' ha sido removido de favoritos.', 'success');
      this.producto.is_favorite = false;
      this.producto.favorite_to_count--;      
    }).catch(error => {
      this.presentToast('Ha ocurrido un error al quitar el producto de favoritos.', 'danger');
      console.log(error);
    });
  }

  async descartar() {
    this.playSound();
    const alerta = await this.alertCtrl.create({
      header: '¿Estas Seguro?',
      message: 'desea descartar esta propiedad: ' + this.producto.name,
      buttons: [
        {
          text: 'No',
          handler: () =>{
            this.playSound();
          }
        },
        {
          text: 'Si',
          handler: async () =>{
              this.playSound();
              const loading = await this.loadingCtrl.create({
                spinner: 'dots',
                message: 'Cargando...'
              });
              loading.present();
              this.productosService.discardProduct(this.producto.id).then(response => {
                loading.dismiss().then(()=>{
                  this.modalCtrl.dismiss();
                  this.presentToast('La propiedad... ' + this.producto.name + ', ha sido descartada', 'secondary');
                  this.productosService.getProducts();
                });                
              }).catch(error => {
                console.log(error);
                loading.dismiss().then(()=>{
                  this.presentToast(error.error.errors.property_id[0], 'danger');
                });                
              });                        
          }
        }
      ]
    });
    await alerta.present();
  }

  async matchear(producto) {
    this.playSound();

    if (this.authService.user.profile && this.authService.user.address) {
      this.alertCtrl.create({
        header: '¿Desea intentar matchear este anuncio?',
        message: this.producto.name,
        buttons: [
          {
            text: 'no',
            handler: () => {
              this.playSound();
            }
          },
          {
            text: 'si',
            handler: async () => {
              this.playSound();
              const loading = await this.loadingCtrl.create({
                spinner: 'dots',
                message: 'Enviando Solicitud...'
              });
              await loading.present();
              this.matchService.storeMatch({property_id: this.producto.id, message: 'Hola quisiera matchear: ' + this.producto.name}).then(response =>{
                console.log(response);
                this.modalCtrl.dismiss().then(() =>{
                  this.router.navigateByUrl('/tabs/tabs/mis-matchs');
                })                
              }).catch(err =>{
                console.log(err);
                this.presentToast('Ha ocurrido un error al matchear la propiedad.', 'danger');
              }).finally(async ()=>{
                await loading.dismiss();
              })
            }
          }
        ]
      }).then(a => a.present());
    } else {
      this.alertCtrl.create({
        header: 'Debe completar primero su perfil',
        message: 'Para poder matchear una propiedad primero debe completar su perfil ;).',
        buttons: [
          {
            text: 'SEGUIR MIRANDO',
            handler: () => {
              this.playSound();
            }
          },
          {
            text: 'COMPLETAR PERFIL',
            handler: async () => {
              this.playSound();
              this.router.navigateByUrl('/user-profile');
            }
          }
        ]
      }).then(a => a.present());
    }
  }

  async presentToast(text, color) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000,
      color: color,
      mode: 'ios'
    });
    toast.present();
  }

  async openPreview(img){
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      cssClass: 'b_transparent',
      componentProps: {
        img: img
      }
    });

    modal.present();
  }


}
