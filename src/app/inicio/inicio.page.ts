import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSlides, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AlertPage } from '../alert/alert.page';
import { FiltrosPage } from '../filtros/filtros.page';
import { AuthenticationService } from '../servicios/authentication.service';
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
        return '<span class="swiper-pagination-bullet swiper-pagination-bullet-active-main custom-bullets-inicio">' + (index + 1) + '</span>';
      }
    }
  };

  @ViewChild('slideHome', { static: true }) protected slides: IonSlides;

  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthenticationService,
    private http: HttpClient,
    private router: Router
  ) { }

  async ngOnInit() {

  }

  async ionViewDidEnter() {
    //alert(JSON.stringify(this.authService.user));
    this.slides.update();
    this.productos = await this.productosService.getProducts();
    console.log(this.productos.getValue());
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
          handler: () => {
            this.playSound();
          }
        },
        {
          text: 'Si',
          handler: async () => {
            this.playSound();
            const loading = await this.loadingCtrl.create({
              spinner: 'dots',
              message: 'Cargando...'
            });
            loading.present();
            this.productosService.discardProduct(product.id).then(response => {
              for (let [index, p] of this.productos.getValue().entries()) {
                if (p.id === product.id) {
                  this.productos.getValue().splice(index, 1);
                  this.slides.update();
                }
              }
              loading.dismiss().then(() => {
                this.presentToast('La propiedad... ' + product.name + ', ha sido descartada', 'secondary');
              });
            }).catch(error => {
              console.log(error);
              loading.dismiss().then(() => {
                this.presentToast(error.error.errors.property_id[0], 'danger');
              });
            });
          }
        }
      ]
    });
    await alerta.present();
  }

  async initChat(product) {

    this.playSound();
    this.alertCtrl.create({
      header: '¿Desea intentar matchear este anuncio?',
      message: product.name,
      buttons: [
        {
          text: 'no'
        },
        {
          text: 'si',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              spinner: 'dots',
              message: 'Enviando Mensaje.'
            });
            loading.present();
            let mensaje = {
              content: 'Hola buenos dias quisiera matchear ' + product.name,
              recipient_id: product.realEstateAgency.user_id
            }
            this.http.post(this.authService.api + '/chats', mensaje, {
              headers: this.authService.authHeader
            }).toPromise().then(async (response: any) => {
              await loading.dismiss();
              this.router.navigateByUrl('/tabs/tabs/chat');
            }).catch(async err => {
              await loading.dismiss();
              console.log(err);
            })
          }
        }
      ]
    }).then(a => a.present());

  }

  async doRefresh(event) {
    this.productos = await this.productosService.getProducts();
    this.slides.update();
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
