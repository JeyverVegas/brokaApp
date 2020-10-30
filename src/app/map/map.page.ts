import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { error } from 'protractor';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../interface';
import { MapOptionsPage } from '../map-options/map-options.page';
import { AuthenticationService } from '../servicios/authentication.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ShowProductPage } from '../show-product/show-product.page';

declare var google: any;

export function CustomMarker(latlng, map, imageSrc, callback = null, user) {
  this.latlng_ = latlng;
  this.imageSrc = imageSrc;
  this.user = user;
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
    if (this.user) {
      div.style.zIndex = "99999999999";
    }

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

  productos = [];
  user: Usuario = null;
  cargado = false;
  currentPosition = null;
  radius = 10;
  map = null;
  markers = [];
  mapRadius = null;
  errorLocation = true;
  @ViewChild('googlemap', { static: true }) protected googlemap: ElementRef;

  constructor(
    private productoService: ProductosService,
    private navCtrl: NavController,
    private smartAudio: SmartAudioService,
    public modalCtrl: ModalController,
    private geolocation: Geolocation,
    private authService: AuthenticationService,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.user = this.authService.user;
    this.productoService.getProducts().then(products => {
      this.errorLocationAlert(products);
      products.subscribe(productos => {
        this.geolocation.getCurrentPosition().then(location => {
          this.errorLocation = false;
          this.productos = productos;
          this.currentPosition = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
          this.markers = [];
          this.crearMapa();
        });
      }, err => {
        alert(JSON.stringify(err));
      })
    }).catch(err => {
      alert(JSON.stringify(err));
    })
  }

  errorLocationAlert(products) {
    setTimeout(() => {
      if (this.errorLocation) {
        if(this.user.address !== null){
          alert('heeloo');
          products.subscribe(productos => {          
            this.currentPosition = new google.maps.LatLng(this.user.address.latitude, this.user.address.longitude);
            this.errorLocation = false;
            this.productos = productos;
            this.markers = [];
            this.crearMapa();
          }, err => {
            alert(JSON.stringify(err));
          })
        }else{
          this.alertCtrl.create({
            header: 'Error al obtener su ubícacion actual.',
            message: 'Ha Ocurrido un error al obtener su ubicacion actual por favor verifique que el "GPS" del telefono este activado, o registre una direccion en la configuracion de la cuenta.',
            buttons: [
              {
                text: 'cerrar mapa.',
                handler: () => {
                  this.navCtrl.back();
                }
              },
              {
                text: 'Añadir Ubicación',
                handler: () => {
                  this.navCtrl.navigateForward('/user-profile')
                }
              }
            ]
          }).then(a => a.present());
        }        
      }          
    }, 10000);
}


async crearMapa() {
  this.map = new google.maps.Map(this.googlemap.nativeElement, {
    center: this.currentPosition,
    zoom: 8,
    mapTypeControl: false,
    zoomControl: false,
    scaleControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });

  this.map.addEventListener('click', (event)=>{
    console.log(event);
  })

  if (
    this.user.profile === null ||
    this.user.profile === undefined ||
    this.user.profile.image === null ||
    this.user.profile.image === undefined ||
    this.user.profile.image === '') {
    new CustomMarker(
      this.currentPosition,
      this.map,
      '../../assets/images/user.png',
      null,
      true
    )
  } else {
    new CustomMarker(
      this.currentPosition,
      this.map,
      this.user.profile.image,
      null,
      true
    )
  }


  this.productos.forEach(producto => {
    if ((google.maps.geometry.spherical.computeDistanceBetween(this.currentPosition, new google.maps.LatLng(producto.address.latitude, producto.address.longitude)) / 1000) < this.radius) {
      let marker = new CustomMarker(
        new google.maps.LatLng(producto.address.latitude, producto.address.longitude),
        this.map,
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
        },
        false,
      );
      this.markers.push(marker);
    } else {
      let marker = new CustomMarker(
        new google.maps.LatLng(producto.address.latitude, producto.address.longitude),
        null,
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
        },
        false,
      );
      this.markers.push(marker);
    }
  });

  this.setRadius();
  this.cargado = true;
}

async openOptions() {
  this.playSound();
  const modal = await this.modalCtrl.create({
    component: MapOptionsPage,
    cssClass: 'map-options-modal',
    swipeToClose: true,
    mode: 'ios',
    componentProps: {
      radius: this.radius
    }
  });

  modal.present();
  modal.onWillDismiss().then((response: any) => {
    if (response.data.position) {
      this.currentPosition = response.data.currentPosition;
      this.crearMapa();
    }
    if (response.data.cerrarMapa) {
      this.navCtrl.back();
    }
    this.radius = response.data.radius;
    this.mapRadius.setRadius(response.data.radius * 1000);
    this.setMapOnAll();
  }).catch(error => {
    console.log(error);
  })

}

setMapOnAll() {
  for (let i = 0; i < this.markers.length; i++) {
    if ((google.maps.geometry.spherical.computeDistanceBetween(this.currentPosition, new google.maps.LatLng(this.markers[i].getPosition().lat(), this.markers[i].getPosition().lng())) / 1000) < this.radius) {
      this.markers[i].setMap(this.map);
    } else {
      this.markers[i].setMap(null);
    }
  }
}

setRadius() {
  let map = this.map;
  this.mapRadius = new google.maps.Circle({
    strokeColor: "#001c5b",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#001b5b70",
    fillOpacity: 0.35,
    map,
    center: this.currentPosition,
    radius: this.radius * 1000,
  });
}

goBack() {
  this.playSound();
  this.navCtrl.back();
}

playSound() {
  this.smartAudio.play('tabSwitch');
}
}
