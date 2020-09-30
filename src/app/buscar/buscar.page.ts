import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  productos = new BehaviorSubject([]);
  filtro = new BehaviorSubject([]);

  

  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService 
  ) { }

  ngOnInit() {
    this.productos = this.productosService.getProducts();
    this.initializedItems();
  }

  initializedItems() {
    this.filtro.next(this.productos.getValue());
  }

  filtrar(ev) {
    this.initializedItems();

    const valor = ev.target.value;

    if (!valor) {
      return
    }    

      this.filtro.next(this.filtro.getValue().filter(producto => {
        if (producto.nombre && valor) {
          return (producto.nombre.toLowerCase().indexOf(valor.toLowerCase()) > -1);
        }
      }))    
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

  addToFavorite(producto) {
    this.playSound();
    producto.favorito = !producto.favorito;
    this.productosService.addProductFavorito(producto);
  }

  removeFromFavorite(producto) {
    this.playSound();
    producto.favorito = !producto.favorito;
    this.productosService.removeProductFavorito(producto);
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
