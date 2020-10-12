import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonSlides, ModalController, NavParams, ToastController } from '@ionic/angular';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

declare var google: any;

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.page.html',
  styleUrls: ['./show-product.page.scss'],
})
export class ShowProductPage implements OnInit {

  producto = null;
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
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private productosService: ProductosService,
    private smartAudio: SmartAudioService,
    private toastController: ToastController
  ) { }

  ionViewDidEnter() {
    this.slides.update();
  }

  ngOnInit() {
    this.producto = this.navParams.get('producto');
    console.log(this.producto);
    this.crearMapa();
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }

  crearMapa() {
    var map = new google.maps.Map(this.map.nativeElement, {
      center: {lat: Number(this.producto.address.latitude), lng: Number(this.producto.address.longitude)}, 
      zoom: 10,      
      mapTypeControl: false,
      zoomControl: true,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    var marker = new google.maps.Marker({
      position: {lat: Number(this.producto.address.latitude), lng: Number(this.producto.address.longitude)},
      map: map,      
      title: 'hola',
      label: {        
        color: "#222428",
        fontSize: "14px",
        fontWeight: 'bold',
        text: this.producto.name
      },
      icon: {
        url: '../../assets/icon/marker.png',
        labelOrigin: new google.maps.Point(73, 15),      
      }
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

  descartar(){    
    this.playSound();
    //this.productosService.descartarProducto(this.producto);
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
