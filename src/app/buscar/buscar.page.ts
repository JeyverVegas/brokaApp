import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ProductosService } from '../servicios/productos.service';
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
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.productos = this.productosService.getProducts();
    this.initializedItems();
  }

  initializedItems() {
    this.filtro = this.productos;
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
    const modal = await this.modalCtrl.create({
      component: ShowProductPage,
      componentProps: {
        producto: producto
      }
    });

    modal.present();
  }

  addToFavorite(producto) {
    producto.favorito = !producto.favorito;
    this.productosService.addProductFavorito(producto);
  }

  removeFromFavorite(producto) {
    producto.favorito = !producto.favorito;
    this.productosService.removeProductFavorito(producto);
  }

}
