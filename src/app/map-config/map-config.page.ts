import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

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
    private geolocation : Geolocation
  ) { }

  async ngOnInit() {
    this.location.lat = await (await this.geolocation.getCurrentPosition()).coords.latitude;
    this.location.lng = await (await this.geolocation.getCurrentPosition()).coords.longitude;
    this.cargado = true;    
    this.crearMapa();
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
    
    this.addMarker(this.location);
    
    this.mapInitialized.addListener('click', (event)=>{
      this.addMarker({lat: event.latLng.lat(), lng: event.latLng.lng()})
    });    
  }

  changeZoom(event){
    this.zoom = event.target.value;
    this.mapInitialized.setZoom(this.zoom);
  }

  addZoom(){
    this.zoom++;
    this.mapInitialized.setZoom(this.zoom);
  }

  removeZoom(){
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

  saveLocation(){
    console.log(this.location);
  }



}
