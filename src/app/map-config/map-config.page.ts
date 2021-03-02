import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController, ToastController } from '@ionic/angular';

declare var google: any;
@Component({
  selector: 'app-map-config',
  templateUrl: './map-config.page.html',
  styleUrls: ['./map-config.page.scss'],
})
export class MapConfigPage implements OnInit {

  @ViewChild('mapconfig', { static: true }) protected mapconfig: ElementRef;
  zoom = 10;
  mapInitialized = null;
  markers = [];
  location = { lat: -34.6083, lng: -58.3712 }
  cargado = false;
  constructor(
    private geolocation: Geolocation,
    private modalCtrl: ModalController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    try {
      var location = await (await this.geolocation.getCurrentPosition()).coords;
      if (!location) {
        this.modalCtrl.dismiss();
        this.presentToast('ha ocurrido un error al obtener tu dirección. itente mas tarde.', 'danger');
        return;
      }

      this.location.lat = location.latitude;
      this.location.lng = location.longitude;
      this.cargado = true;
      this.crearMapa();
    } catch (error) {
      this.modalCtrl.dismiss();
      this.presentToast('ha ocurrido un error al obtener tu dirección. itente mas tarde.', 'danger');
    }
  }

  crearMapa() {
    this.mapInitialized = new google.maps.Map(this.mapconfig.nativeElement, {
      center: this.location,
      zoom: this.zoom,
      mapTypeControl: false,
      zoomControl: false,
      scaleControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    this.mapInitialized.addListener('idle', (event) => {
      var center = this.mapInitialized.getCenter();
      center.e += 0.000001;
      this.mapInitialized.panTo(center);
      center.e -= 0.000001;
      this.mapInitialized.panTo(center);
    });

    this.addMarker(this.location);

    this.mapInitialized.addListener('click', (event) => {
      this.addMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() })
    });
  }

  changeZoom(event) {
    this.zoom = event.target.value;
    this.mapInitialized.setZoom(this.zoom);
  }

  addZoom() {
    this.zoom++;
    this.mapInitialized.setZoom(this.zoom);
  }

  removeZoom() {
    this.zoom--;
    this.mapInitialized.setZoom(this.zoom);
  }

  addMarker(location) {
    this.deleteMarkers();
    const marker = new google.maps.Marker({
      position: location,
      map: this.mapInitialized,
      icon: '../../assets/icon/marker.png'
    });
    this.location = location;
    this.markers.push(marker);
  }

  setMapOnAll(map: any | null) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  saveLocation() {
    this.modalCtrl.dismiss(this.location);
  }

  async presentToast(text, color) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000,
      color: color
    });
    toast.present();
  }



}
