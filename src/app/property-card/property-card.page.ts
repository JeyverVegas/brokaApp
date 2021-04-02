import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductosService } from '../servicios/productos.service';
import { } from 'googlemaps';
import { GoogleMapsApiService } from '../servicios/google-maps-api.service';
import { googleMapsControlOpts } from '../interface';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.page.html',
  styleUrls: ['./property-card.page.scss'],
})
export class PropertyCardPage implements OnInit {

  @Input() property: any;

  @ViewChild('googlemapproduct', { static: true }) mapElement: ElementRef

  map: google.maps.Map;

  productMarker: any;

  MapBrokaControls: googleMapsControlOpts = {
    showMyPositionButton: false,
    showRadiusButton: false,
    draggable: false,
    zoom: 15
  }

  constructor(
    private modalCtrl: ModalController,
    private productosService: ProductosService,
    private googleMapsApiService: GoogleMapsApiService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if (google) {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: this.property.address.latitude, lng: this.property.address.longitude },
        zoom: 15,
        mapTypeControl: false,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        draggable: false
      });
      this.setMarker();
    }
  }

  setMarker(map?) {
    var brokaMarkerClass = this.googleMapsApiService.getBrokaMarker();
    this.productMarker = new brokaMarkerClass(
      new google.maps.LatLng(this.property.address.latitude, this.property.address.longitude),
      this.property.images[0].url,
      null,
      false
    );
    this.productMarker.setMap(this.map);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  findPrice(prices: any[]) {
    var price = null;

    if (this.productosService.filtros.currency) {
      price = prices.find(price => price.currency.id == this.productosService.filtros.currency);
    } else {
      price = prices[0];
    }

    if (price) {
      price.price_value = parseInt(price.price_value, 0);
    }

    return price;
  }

}
