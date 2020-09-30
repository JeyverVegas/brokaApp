import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController, NavParams } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ShowProductPage } from '../show-product/show-product.page';

declare var google: any;

@Component({
  selector: 'app-show-inmobiliaria',
  templateUrl: './show-inmobiliaria.page.html',
  styleUrls: ['./show-inmobiliaria.page.scss'],
})
export class ShowInmobiliariaPage implements OnInit {

  inmobiliaria = null;
  @ViewChild('mapa', { static: true }) protected mapa: ElementRef;
  productos = new BehaviorSubject([]);

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private productosService: ProductosService,
    private smartAudio: SmartAudioService
  ) { }

  ngOnInit() {
    this.inmobiliaria = this.navParams.get('inmobiliaria');
    console.log(this.inmobiliaria);
    this.crearMapa();
    this.productos = this.productosService.getProducts();
  }

  closeModal(){
    this.playSound();
    this.modalCtrl.dismiss();
  }

  crearMapa() {
    var map = new google.maps.Map(this.mapa.nativeElement, {
      center: { lat: -34.609129, lng: -58.426284 }, 
      zoom: 10,      
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    var marker = new google.maps.Marker({
      position: {lat: -34.609129, lng: -58.426284},
      map: map,      
      title: 'hola',
      label: {        
        color: "#222428",
        fontSize: "14px",
        fontWeight: 'bold',
        text: this.inmobiliaria.nombre
      },
      icon: {
        url: '../../assets/icon/marker.png',
        labelOrigin: new google.maps.Point(73, 15),      
      }
    });
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

  playSound(){
    this.smartAudio.play('tabSwitch');
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
