import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { BrokaMarkers, Usuario } from '../interface';
import { MapOptionsPage } from '../map-options/map-options.page';
import { AuthenticationService } from '../servicios/authentication.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ShowProductPage } from '../show-product/show-product.page';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  user: Usuario = null;
  backupAddress = {
    state: null,
    city: null
  };

  showRadio = false;
  userMarker: BrokaMarkers = null;
  cargado = false;
  currentPosition: { lat: number, lng: number } = null;
  radius = 10;
  map = null;
  productos = new BehaviorSubject([]);
  productsMarkers = [];
  mapRadius = null;
  @ViewChild('googlemap', { static: true }) protected googlemap: ElementRef;

  constructor(
    private productoService: ProductosService,
    private navCtrl: NavController,
    private smartAudio: SmartAudioService,
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private authService: AuthenticationService,
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {

  }

  ionViewWillLeave() {
    this.productoService.filtros.radius = null;
    this.productoService.getProducts();
  }

  async ionViewDidEnter() {
    this.user = this.authService.user;
    this.backupAddress.city = this.productoService.filtros.city;
    this.backupAddress.state = this.productoService.filtros.state;
    this.productoService.filtros.city = null;
    this.productoService.filtros.state = null;
    console.log(this.backupAddress.city);
    try {
      var location = await this.geolocation.getCurrentPosition({ timeout: 5000, maximumAge: 0 });
      this.currentPosition = { lat: location.coords.latitude, lng: location.coords.longitude };
      this.productoService.filtros.radius = [this.radius, this.currentPosition.lat, this.currentPosition.lng];
      this.productos = this.productoService.getProducts();
      this.crearMapa();
    } catch (error) {
      if (this.user.address && this.user.address.latitude && this.user.address.longitude) {
        this.currentPosition = { lat: this.user.address.latitude, lng: this.user.address.longitude };
        this.productoService.filtros.radius = [this.radius, this.currentPosition.lat, this.currentPosition.lng];
        this.crearMapa();
        this.productos = this.productoService.getProducts();
      } else {
        const alerta = await this.alertCtrl.create({
          header: 'Error: No Hemos podido obtener tu ubicación',
          message: 'Esto quizas se deba a que tienes el gps desactivado o no hay conexión a internet. Puedes intentar mas tarde entrando de nuevo al mapa, o puedes proporcionarnos una ubicacion en la pantalla de comppletar perfil ;).',
          buttons: [
            {
              text: 'Cerrar Mapa',
              handler: () => {
                this.goBack();
              }
            },
            {
              text: 'Añadir ubicación',
              handler: () => {
                this.navCtrl.navigateForward('user-profile');
              }
            }
          ]
        });
        alerta.present();
      }
    }
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

    /* this.map.addListener('idle', (event) => {
      var center = this.map.getCenter();
      center.e += 0.000001;
      this.map.panTo(center);
      center.e -= 0.000001;
      this.map.panTo(center);
    }); */

    this.map.addListener('click', async (event) => {
      console.log(event);
      const alerta = await this.alertCtrl.create({
        header: '¿Quieres cambiar tu ubicación?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.playSound()
            }
          },
          {
            text: 'Si',
            handler: () => {
              this.userMarker.setMap(null);
              this.mapRadius.setMap(null);
              this.deleteMarkers();
              this.currentPosition.lat = event.latLng.lat();
              this.currentPosition.lng = event.latLng.lng();
              this.map.setCenter(event.latLng);
              this.setRadius(this.map);
              let userMakerImg = '../../assets/images/user.png';
              if (
                this.user.profile &&
                this.user.profile.image &&
                this.user.profile.image.length > 0) {
                userMakerImg = this.user.profile.image;
              }
              this.userMarker = new BrokaMarkers(
                new google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng),
                userMakerImg,
                null,
                true
              );
              this.userMarker.setMap(this.map);
              this.productoService.filtros.radius = [this.radius, this.currentPosition.lat, this.currentPosition.lng];
              this.productoService.getProducts();
            }
          }
        ]
      })
      alerta.present();
    })

    let userMakerImg = '../../assets/images/user.png';

    if (
      this.user.profile &&
      this.user.profile.image &&
      this.user.profile.image.length > 0) {
      userMakerImg = this.user.profile.image;
    }

    this.userMarker = new BrokaMarkers(
      new google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng),
      userMakerImg,
      null,
      true
    );

    this.userMarker.setMap(this.map);

    this.productos.subscribe(productos => {
      this.deleteMarkers();
      productos.forEach(producto => {
        let marker = new BrokaMarkers(
          new google.maps.LatLng(producto.address.latitude, producto.address.longitude),
          producto.images[0].url,
          () => {
            this.openProduct(producto);
          }
        );
        marker.setMap(this.map);

        this.productsMarkers.push(marker);
      });
    }, error => {
      console.log(error);
    });

    this.setRadius(this.map);
    this.cargado = true;
  }


  async openProduct(producto) {
    /* this.playSound();
    const modal = await this.modalCtrl.create({
      component: ShowProductPage,
      componentProps: {
        producto: producto
      }
    });
    modal.present(); */
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
      let consultar = false;
      if (!response.data) {
        return
      }
      if (response.data.radius && this.radius != response.data.radius) {
        consultar = true;
        this.radius = response.data.radius;
      }

      if (response.data.currentPosition) {
        this.currentPosition = response.data.currentPosition;
        this.userMarker.setMap(null);
        this.deleteMarkers();
        this.map.setCenter(new google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng));
        let userMakerImg = '../../assets/images/user.png';
        if (
          this.user.profile &&
          this.user.profile.image &&
          this.user.profile.image.length > 0) {
          userMakerImg = this.user.profile.image;
        }
        this.userMarker = new BrokaMarkers(
          new google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng),
          userMakerImg,
          null,
          true
        );
        this.userMarker.setMap(this.map);
        consultar = true;
      }

      if (response.data.cerrarMapa) {
        this.navCtrl.back();
      }

      if (consultar) {
        this.mapRadius.setMap(null);
        this.setRadius(this.map);
        this.productoService.filtros.radius = [this.radius, this.currentPosition.lat, this.currentPosition.lng];
        this.productoService.getProducts();
        console.log('hay que consultar');
      }
    }).catch(error => {
      console.log(error);
    })

  }

  async getPosition() {
    var location = await this.geolocation.getCurrentPosition({ timeout: 5000, maximumAge: 0 });
    if (!location) {
      this.presentToast('ha ocurrido un error al obtener la ubicacion. por favor intente mas tarde.', 'danger');
      return;
    }
    this.userMarker.setMap(null);
    this.currentPosition = { lat: location.coords.latitude, lng: location.coords.longitude };

    this.deleteMarkers();

    this.map.setCenter(new google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng));

    let userMakerImg = '../../assets/images/user.png';
    if (
      this.user.profile &&
      this.user.profile.image &&
      this.user.profile.image.length > 0) {
      userMakerImg = this.user.profile.image;
    }

    this.userMarker = new BrokaMarkers(
      new google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng),
      userMakerImg,
      null,
      true
    );

    this.productoService.filtros.radius = [this.radius, this.currentPosition.lat, this.currentPosition.lng];
    this.productos = this.productoService.getProducts();
    this.userMarker.setMap(null);
    this.userMarker.setMap(this.map);
    this.mapRadius.setMap(null);
    this.setRadius(this.map);
  }

  deleteMarkers() {
    this.productsMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.productsMarkers = [];
  }

  setRadius(map) {
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

  removeRadius() {
    if (this.radius > 5) {
      this.radius--;
    }
  }

  radiusHasBlur() {
    console.log('yoho');
    /* this.mapRadius.setMap(null);
    this.setRadius(this.map);
    this.productoService.filtros.radius = [this.radius, this.currentPosition.lat, this.currentPosition.lng];
    this.productoService.getProducts(); */
  }

  radiusChange() {
    this.mapRadius.setMap(null);
    this.setRadius(this.map);
    this.productoService.filtros.radius = [this.radius, this.currentPosition.lat, this.currentPosition.lng];
    this.productoService.getProducts();
  }

  addRadius() {
    if (this.radius < 25) {
      this.radius++;
    }
  }

  goBack() {
    this.playSound();
    this.navCtrl.back();
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

  playSound() {
    this.smartAudio.play('tabSwitch');
  }
}
