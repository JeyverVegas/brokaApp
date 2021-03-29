import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
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

  radius = 20;

  products: any[] = [];

  constructor(
    private navCtrl: NavController,
    private productService: ProductosService
  ) { }

  async ngOnInit() {
    this.productService.filtros.per_page = 999999999999999;

  }

  ionViewWillLeave() {
    this.productService.filtros.per_page = null;
    this.firtsRender = false;
  }

  async loadProperties(event) {
    this.productService.filtros.radius = [event.radius, event.position.lat, event.position.lng];
    console.log(event);
    this.products = (await this.productService.getProducts()).getValue();

    if (!this.products) {
      return;
    }

    this.firtsRender = true;
  }

  async loadProductsByArea(event) {
    this.productService.filtros.within = event;
    this.productService.filtros.radius = null;
    this.products = (await this.productService.getProducts()).getValue();
    console.log(event);
  }

  goback() {
    this.navCtrl.back();
  }

  async changeRadius(event: any) {
    if (this.firtsRender) {
      this.productService.filtros.radius = [event.radius, event.position.lat, event.position.lng];
      this.productService.filtros.within = null;
      this.products = await (await this.productService.getProducts()).getValue();
    }
  }

}
