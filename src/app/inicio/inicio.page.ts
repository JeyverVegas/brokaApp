import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSlides, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AlertPage } from '../alert/alert.page';
import { FiltrosPage } from '../filtros/filtros.page';
import { ProductosService } from '../servicios/productos.service';
import { ShowProductPage } from '../show-product/show-product.page';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  productos = new BehaviorSubject([]);
  favoritos = [];
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
  ) { }  

  ngOnInit() {
    this.productos = this.productosService.getProducts();
    this.slides.update();    
  }
  
  IonViewDidEnter() {
    this.slides.update();
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

  async saveSearch() {
    const modal = await this.modalCtrl.create({
      cssClass: ['alertModal'],
      animated: true,
      component: AlertPage,
    });

    modal.present();
  }

  descartar(product){    
    this.productosService.descartarProducto(product);
  }


}
