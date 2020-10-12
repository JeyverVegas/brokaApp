import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSlides, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AlertPage } from '../alert/alert.page';
import { FiltrosPage } from '../filtros/filtros.page';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ShowProductPage } from '../show-product/show-product.page';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  productos = new BehaviorSubject([]);
  
  slideOpts = {
    direction: 'vertical',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      dynamicBullets: true,
      dynamicMainBullets: 4,
      clickable: true,
      renderBullet: function (index) {
        return '<span class="swiper-pagination-bullet swiper-pagination-bullet-active-main custom-bullets">' + (index + 1) + '</span>';
      }
    }
  };

  @ViewChild('slideHome', { static: true }) protected slides: IonSlides;

  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    this.slides.update();
    this.productos = await this.productosService.getProducts();    
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

  async abriFiltros() {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: FiltrosPage,
      componentProps: {
        minMax: this.productosService.getMaxAndMin(await this.productosService.findProducts())
      }
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
    const alerta = await this.alertCtrl.create({
      header: '¿Estas Seguro?',
      message: 'desea descartar esta propiedad: ' + product.name,
      buttons: [
        {
          text: 'No',          
        },
        {
          text: 'Si',
          handler: () =>{
            this.presentToast('La propiedad... ' + product.name + ', ha sido descartada', 'secondary');
          }
        }
      ]
    });
    await alerta.present();
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
      color: color
    });
    toast.present();
  }

}
