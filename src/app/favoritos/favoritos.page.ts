import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductosService } from '../servicios/productos.service';
import { ShowProductPage } from '../show-product/show-product.page';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  favoritos = [];

  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.favoritos = this.productosService.getFavoritos();
    console.log(this.favoritos);
  }

  async openProduct(producto){
    const modal = await this.modalCtrl.create({
      component: ShowProductPage,
      componentProps: {
        producto: producto
      }
    });

    modal.present();
  }

}
