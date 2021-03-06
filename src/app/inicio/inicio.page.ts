import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AlertPage } from '../alert/alert.page';
import { FiltrosPage } from '../filtros/filtros.page';
import { BrokaMarkers } from '../interface';
import { AuthenticationService } from '../servicios/authentication.service';
import { ChatService } from '../servicios/chat.service';
import { MatchService } from '../servicios/match.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ShowProductPage } from '../show-product/show-product.page';
declare var google: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {

  @ViewChildren('mapa') protected mapas: QueryList<ElementRef>;
  @ViewChildren('containerx') protected containerx: QueryList<ElementRef>;
  productos = new BehaviorSubject([]);
  total = new BehaviorSubject(0);
  
  deviceWidth = null;
  showdelete = false;
  showmatch = false;
  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthenticationService,
    private matchService: MatchService,
    private router: Router,
    private chatService: ChatService
  ) { }

  ionViewDidEnter() {
     
    this.productos = this.productosService.getProducts();    
    
    this.mapas.changes.subscribe((elements: any) =>{
      var mapas: any[] = elements.toArray();

      mapas.forEach((mapa: ElementRef) => {
        const map = mapa.nativeElement;        
        const product = this.productos.getValue()[Number(map.dataset.index)];        
        this.crearMapa(map, product, Number(map.dataset.index));
      })
    })
  }

  crearMapa(mapa, product, index) {
    if(google){
      var map = new google.maps.Map(mapa, {
        center: { lat: product.address.latitude, lng: product.address.longitude },
        zoom: 10,
        mapTypeControl: false,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      });    
  
      map.addListener('drag', ()=>{
         const element: HTMLElement = this.containerx.toArray().find(elements => Number(elements.nativeElement.dataset.index) == index).nativeElement;
         element.style.overflow = "hidden";      
      });

      map.addListener('dragstart', ()=>{
        const element: HTMLElement = this.containerx.toArray().find(elements => Number(elements.nativeElement.dataset.index) == index).nativeElement;
        element.style.overflow = "hidden";      
     });
  
      map.addListener('dragend', ()=>{
        const element: HTMLElement = this.containerx.toArray().find(elements => Number(elements.nativeElement.dataset.index) == index).nativeElement;
        element.style.overflow = "auto";      
     })
  
      var marker = new BrokaMarkers(
        new google.maps.LatLng(product.address.latitude, product.address.longitude),
        product.images[0].url
      );
  
      marker.setMap(map);
    }    
  }

  async openProduct(producto) {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: ShowProductPage,
      componentProps: {
        producto: producto
      }
    });

    modal.present();
  }

  findPrice(prices: any[]) {
    var price = null;
    if (this.productosService.filtros.currency) {
      price = prices.find(price => price.currency.id == this.productosService.filtros.currency);
    } else {
      price = prices[0];      
    }

    price.price_value = parseInt(price.price_value, 0);
    return price;
  }

  async abriFiltros() {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: FiltrosPage
    });

    modal.present();
  }

  async saveSearch() {
    this.playSound();
    const modal = await this.modalCtrl.create({
      cssClass: ['alertModal'],
      animated: true,
      component: AlertPage,
    });

    modal.present();
  }

  async descartar(product) {
    this.playSound();
    this.showdelete = true;
    this.productosService.discardProduct(product.id).then(response => {
      for (let [index, p] of this.productos.getValue().entries()) {
        if (p.id === product.id) {

          this.productos.getValue().splice(index, 1);
        }
      }
      if (this.productos.value.length == 0) {
        this.productosService.getProducts();
      }      
    }).catch(error => {
      console.log(error);
      this.presentToast(error.error.errors.property_id[0], 'danger');
    }).finally(() => {
      this.showdelete = false;
    });
  }

  async matchear(product) {
    this.playSound();

    if (this.authService.user.profile && this.authService.user.address) {
      this.playSound();      
      this.showmatch = true;
      this.matchService.storeMatch({ property_id: product.id, message: 'Hola quisiera matchear: ' + product.name }).then(response => {
        this.chatService.getChats();
        for (let [index, p] of this.productos.getValue().entries()) {
          if (p.id === product.id) {
  
            this.productos.getValue().splice(index, 1);
          }
        }
        if (this.productos.value.length == 0) {
          this.productosService.getProducts();
        }      
      }).catch(err => {
        console.log(err);
        this.presentToast('Ha ocurrido un error al matchear la propiedad.', 'danger');
      }).finally(async () => {
        this.showmatch = false;
      });
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

  async doRefresh(event) {
    this.productos = await this.productosService.getProducts();
    event.target.complete();
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

  async presentToast(text, color) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000,
      color: color,
      buttons: [
        'ok'
      ]
    });
    toast.present();
  }

}
