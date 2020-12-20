import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AlertPage } from '../alert/alert.page';
import { FiltrosPage } from '../filtros/filtros.page';
import { AuthenticationService } from '../servicios/authentication.service';
import { ChatService } from '../servicios/chat.service';
import { MatchService } from '../servicios/match.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ShowProductPage } from '../show-product/show-product.page';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {

  productos = new BehaviorSubject([]);
  total = new BehaviorSubject(0);
  slideOpts = {
    direction: 'vertical',
  };
  deviceWidth = null;

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
    this.total = this.productosService.getTotal();
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
    const loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Cargando...'
    });
    loading.present();
    this.productosService.discardProduct(product.id).then(response => {
      for (let [index, p] of this.productos.getValue().entries()) {
        if (p.id === product.id) {

          this.productos.getValue().splice(index, 1);
        }
      }
      loading.dismiss().then(() => {
        if (this.productos.value.length == 0) {
          this.productosService.getProducts();
        }        
        this.total.next(this.total.value - 1);
      });
    }).catch(error => {
      console.log(error);
      loading.dismiss().then(() => {
        this.presentToast(error.error.errors.property_id[0], 'danger');
      });
    });
  }

  async matchear(product) {
    this.playSound();

    if (this.authService.user.profile && this.authService.user.address) {
      this.playSound();
      const loading = await this.loadingCtrl.create({
        spinner: 'dots',
        message: 'Enviando Solicitud...'
      });
      await loading.present();
      this.matchService.storeMatch({ property_id: product.id, message: 'Hola quisiera matchear: ' + product.name }).then(response => {
        this.chatService.getChats();
        console.log(response);
        this.router.navigateByUrl('/tabs/tabs/mis-matchs');
      }).catch(err => {
        console.log(err);
        this.presentToast('Ha ocurrido un error al matchear la propiedad.', 'danger');
      }).finally(async () => {
        await loading.dismiss();
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
