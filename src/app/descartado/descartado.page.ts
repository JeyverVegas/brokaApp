import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-descartado',
  templateUrl: './descartado.page.html',
  styleUrls: ['./descartado.page.scss'],
})
export class DescartadoPage implements OnInit {

  descartados = [];

  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private smartAudio: SmartAudioService,
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
  }

  async ionViewDidEnter() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'crescent'
    });
    loading.present();
    this.descartados = await this.productosService.getDescartados();
    loading.dismiss();
    console.log(this.descartados);
  }

  async openPreview(img) {
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      cssClass: 'b_transparent',
      componentProps: {
        img: img
      }
    });

    modal.present();
  }

  async removeDiscard(product) {
    this.playSound();
    const alerta = await this.alertCtrl.create({
      header: '¿Desea reestablecer este inmueble?',
      message: product.name,
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
            this.productosService.removeDiscardProduct(product.id).then(response => {
              for (let [index, p] of this.descartados.entries()) {
                if (p.id === product.id) {
                  this.descartados.splice(index, 1);
                }
              }
              loading.dismiss().then(() => {
                this.presentToast('La propiedad... ' + product.name + ', ha sido reestablecida.', 'secondary');
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

  async presentToast(text, color) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000,
      color: color,
      buttons: ['ok']
    });
    toast.present();
  }

  async reloadAll() {
    this.playSound();
    const alerta = await this.alertCtrl.create({
      header: '¿Quieres reestablecer todos los inmuebles?',
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
              spinner: 'lines',
              message: 'Reestablenciendo todos los inmuebles...'
            });
            await loading.present();
            this.productosService.removerAllDiscartedProducts().then(response => {
              this.descartados = [];
              this.presentToast('Se han reestablecido todos los inmuebles ;)', 'secondary');
            }).catch(err => {
              console.log(err);
              this.presentToast('Ha ocurrido un error al reestablecer los inmuebles :(', 'danger');
            }).finally(() => {
              loading.dismiss();
            })
          }
        }
      ]
    });
    alerta.present();
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

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

}
