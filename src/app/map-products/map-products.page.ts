import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Filtros2Page } from '../filtros2/filtros2.page';
import { googleMapsControlOpts } from '../interface';
import { ProductosService } from '../servicios/productos.service';

@Component({
  selector: 'app-map-products',
  templateUrl: './map-products.page.html',
  styleUrls: ['./map-products.page.scss'],
})
export class MapProductsPage implements OnInit {

  BrokaControls: googleMapsControlOpts = {
    zoom: 10,
    showMyPositionButton: true,
    showRadiusButton: true
  }

  firtsRender = false;

  cityShape = null;

  radius = 20;

  products: any[] = [];

  constructor(
    private navCtrl: NavController,
    private productService: ProductosService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.productService.filtros.per_page = 999999999999999;
    if (this.productService.filtros.city && this.productService.filtros.city.length > 0) {
      this.cityShape = this.productService.filtros.city[0].shape;
    }
  }

  async ionViewWillLeave() {
    this.productService.filtros.per_page = 10;
    this.firtsRender = false;
  }

  async loadProperties(event) {
    this.productService.filtros.radius = [event.radius, event.position.lat, event.position.lng];
    this.productService.filtros.within = null;
    this.productService.filtros.state = null;
    this.productService.filtros.city = null;
    this.cityShape = null;
    console.log(event);

    (await this.productService.getProducts()).subscribe(products => {
      this.products = products;
    })

    if (!this.products) {
      return;
    }

    this.firtsRender = true;
  }

  async loadProductsByArea(event) {
    this.productService.filtros.within = event;
    this.productService.filtros.radius = null;
    this.productService.filtros.city = null;
    this.productService.filtros.state = null;
    this.cityShape = null;
    this.products = (await this.productService.getProducts()).getValue();
    console.log(event);
  }

  goback() {
    this.navCtrl.back();
  }

  async changeRadius(event: any) {
    if (this.firtsRender) {
      this.productService.filtros.radius = [event.radius, event.position.lat, event.position.lng];
      this.productService.filtros.city = null;
      this.productService.filtros.state = null;
      this.productService.filtros.within = null;
      this.cityShape = null;
      this.products = await (await this.productService.getProducts()).getValue();
    }
  }

  async openFilters() {
    const modal = await this.modalCtrl.create({
      component: Filtros2Page,
      componentProps: {
        commingFromMap: true
      }
    });

    modal.present();

    modal.onWillDismiss().then(modal => {
      if (this.productService.filtros.city && this.productService.filtros.city.length > 0) {
        this.cityShape = this.productService.filtros.city[0].shape;
      } else {
        this.cityShape = null;
      }
    });
  }

}
