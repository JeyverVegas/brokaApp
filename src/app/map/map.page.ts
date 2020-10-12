import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../interface';
import { AuthenticationService } from '../servicios/authentication.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ShowProductPage } from '../show-product/show-product.page';

declare var google: any;

export function CustomMarker(latlng, map, imageSrc, callback = null) {
  this.latlng_ = latlng;
  this.imageSrc = imageSrc;
  this.callback = callback;
  this.setMap(map);
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.draw = function () {
  // Check if the div has been created.
  var div = this.div_;
  if (!div) {
    // Create a overlay text DIV
    div = this.div_ = document.createElement('div');
    // Create the DIV representing our CustomMarker 

    div.onclick = () => this.callback && this.callback();

    div.className = "animate__animated animate__fadeInDown animate__faster customMarker";


    var img = document.createElement("img");    
    img.src = this.imageSrc;
    img.className = "img-iconxD";

    var img2 = document.createElement("img");
    img2.src = "../../assets/images/marker2.png";
    img2.className = "img-iconxD2";
    div.appendChild(img);
    div.appendChild(img2);
    google.maps.event.addDomListener(div, "click", function (event) {
      google.maps.event.trigger(null, "click");
    });

    // Then add the overlay to the DOM
    var panes = this.getPanes();
    panes.overlayImage.appendChild(div);
  }

  // Position the overlay 
  var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
  if (point) {
    div.style.left = point.x + 'px';
    div.style.top = point.y + 'px';
  }
};

CustomMarker.prototype.remove = function () {
  // Check if the overlay was on the map and needs to be removed.
  if (this.div_) {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

CustomMarker.prototype.getPosition = function () {
  return this.latlng_;
};



@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  productos = new BehaviorSubject([]);
  user: Usuario = null;
  cargado = false;
  currentPosition = null;
  @ViewChild('googlemap', { static: true }) protected googlemap: ElementRef;

  constructor(
    private productoService: ProductosService,
    private navCtrl: NavController,
    private smartAudio: SmartAudioService,
    public modalCtrl: ModalController,
    private geolocation: Geolocation,
    private authService: AuthenticationService
  ) { }

  async ngOnInit() {
    this.user = this.authService.user;
    this.productos = await this.productoService.getProducts();
    this.geolocation.getCurrentPosition().then(location => {      
      this.currentPosition = new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
        this.crearMapa();
    });

  }


  async crearMapa() {
    var map = new google.maps.Map(this.googlemap.nativeElement, {
      center: this.currentPosition,
      zoom: 10,
      mapTypeControl: false,
      zoomControl: false,
      scaleControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    new CustomMarker(
      this.currentPosition,
      map,
      this.user.profile.image,
    )

    this.productos.getValue().forEach(producto => {
      new CustomMarker(
        new google.maps.LatLng(Number(producto.address.latitude), Number(producto.address.longitude)),
        map,
        producto.images[0].url,
        () => {
          this.playSound();          
          this.modalCtrl.create({
            component: ShowProductPage,
            componentProps: {
              producto: producto
            }
          })
            .then((m) => m.present());
        }
      );
    })
    this.cargado = true;
  }

  goBack() {
    this.playSound();
    this.navCtrl.back();
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }
}
