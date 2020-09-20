import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonSlides, ModalController, NavParams } from '@ionic/angular';

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
    private actionSheetCtrl: ActionSheetController
  ) { }

  IonViewDidEnter() {
    this.slides.update();
  }

  ngOnInit() {
    this.producto = this.navParams.get('producto');
    console.log(this.producto);
    this.slides.update();
    this.crearMapa();
  }



  crearMapa() {
    var map = new google.maps.Map(this.map.nativeElement, {
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
        text: this.producto.nombre
      },
      icon: {
        url: '../../assets/icon/marker.png',
        labelOrigin: new google.maps.Point(73, 15),      
      }
    });
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  async openShared(){
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

}
