import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ShowProductPage } from '../show-product/show-product.page';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {

  productos = [];
  filtro = [];



  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private toastController: ToastController
  ) { }

  async ngOnInit() {

  }

  async ionViewDidEnter() {
    this.productosService.getProducts().then(products => {
      products.subscribe(productos => {        
        this.productos = productos;
        this.initializedItems();
      })
    }).catch(err => {
      console.log(err);
    })    
  }

  initializedItems() {
    this.filtro = this.productos;
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

  filtrar(ev) {
    this.initializedItems();

    const valor = ev.target.value;

    if (!valor) {
      return
    }

    this.filtro = this.filtro.filter(producto => {
      if (producto.name && valor) {
        return (producto.name.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      }
    });
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
      console.log(error);
    });
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

  async doRefresh(event) {
    this.productosService.getProducts().then(products => {
      products.subscribe(productos => {
        this.productos = productos;
        this.initializedItems();
        event.target.complete();
      })
    }).catch(err => {
      console.log(err);
    })    
  }

}
