import { Component, OnInit } from '@angular/core';
import { googleMapsControlOpts } from '../interface';

@Component({
  selector: 'app-map-products',
  templateUrl: './map-products.page.html',
  styleUrls: ['./map-products.page.scss'],
})
export class MapProductsPage implements OnInit {

  BrokaControls: googleMapsControlOpts = {
    zoom: 10
  }

  constructor() { }

  ngOnInit() {
  }

}
