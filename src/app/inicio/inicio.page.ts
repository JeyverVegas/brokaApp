import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiltrosPage } from '../filtros/filtros.page';
import { ProductosService } from '../servicios/productos.service';
import { ShowProductPage } from '../show-product/show-product.page';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  productos = [];

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

  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController
  ) { }  

  ngOnInit() {
    this.productos = this.productosService.getProducts();    
    console.log(this.productos);
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

  async abriFiltros(){
    const modal = await this.modalCtrl.create({
      component: FiltrosPage
    });

    modal.present();
  }


}
