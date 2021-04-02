import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { PropertyCardPage } from '../property-card/property-card.page';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  favoritos = [];

  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {

  }

  async ionViewDidEnter() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'bubbles'
    });
    await loading.present();
    this.favoritos = await this.productosService.getProductsFavorites();
    loading.dismiss();
  }

  async openProduct(producto) {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: PropertyCardPage,
      componentProps: {
        producto: producto
      }
    });

    modal.present();
  }

  addToFavorite(producto) {
    this.playSound();
    this.productosService.addFavoriteProduct(producto.id).then(response => {
      this.presentToast(producto.name + ' ha sido añadido a favoritos.', 'success');
      producto.is_favorite = true;
      producto.favorite_to_count++;
    }).catch(error => {
      this.presentToast(error.error.errors.property_id[0], 'danger');
    });
  }

  removeFromFavorite(producto) {
    this.playSound();
    this.productosService.removeFavoriteProduct(producto.id).then(response => {
      this.presentToast(producto.name + ' ha sido removido de favoritos', 'success');
      producto.is_favorite = false;
      producto.favorite_to_count--;
    }).catch(error => {
      this.presentToast('Ha ocurrido un error al quitar el producto de favoritos.', 'danger');
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

  playSound() {
    this.smartAudio.play('tabSwitch');
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

  async doRefresh(event) {
    this.favoritos = await this.productosService.getProductsFavorites();
    event.target.complete();
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

}
