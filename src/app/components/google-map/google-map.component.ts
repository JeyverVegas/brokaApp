import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { googleMapsControlOpts, LatLng, } from 'src/app/interface';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { } from 'googlemaps';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { PropertyCardPage } from 'src/app/property-card/property-card.page';
import { SmartAudioService } from 'src/app/servicios/smart-audio.service';
import { GoogleMapsApiService } from 'src/app/servicios/google-maps-api.service';
import MarkerClusterer from '@googlemaps/markerclustererplus';
import { ProductosService } from 'src/app/servicios/productos.service';


@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnInit, OnChanges {

  //INPUTS
  @Input() size: 'normal' | 'fullscreen' | 'small' | 'large' = 'fullscreen';
  @Input() for: 'user' | 'product' = 'user';
  @Input() controls: boolean = true;
  @Input() BrokaControls: googleMapsControlOpts = {
    showMyPositionButton: true,
    showRadiusButton: true,
    draggable: true,
    zoom: 15
  };

  @Input() productsForMarkers: any[] = [];
  @Input() center: { lat: number, lng: number } = { lat: -34.603722, lng: -58.381592 };
  @Input() zoom: number = 8;

  //OUTPUTS
  @Output() onMapLoaded = new EventEmitter<any>();
  @Output() onDrawing = new EventEmitter<boolean>();
  @Output() onChangeRadius = new EventEmitter<any>();
  @Output() onDeleteMarkers = new EventEmitter<any>();
  @Output() onChangeZoom = new EventEmitter<number>();
  @Output() currentPosition = new EventEmitter<{ lat: number, lng: number }>();
  @Output() onAreaSet = new EventEmitter<LatLng[]>();
  @Output() onError = new EventEmitter<{ error: boolean, message: string }>();

  //Map html element
  @ViewChild('googlemap', { static: true }) protected googlemap: ElementRef;


  //Map
  map: google.maps.Map;

  //User Maker - if is required;
  userMarker = null;

  //broka markers array;
  brokaMarkers: any[] = [];

  //Hidden - Show zoom control.
  showRadio = false;

  //Boolean var to hability the draw function this make the map not draggable and add a click event listener for get the latLng of the polygone shape.
  //this too show a accept button or cancel.
  draw: boolean = false;

  //Var for the polygone if this is required;
  polygon: google.maps.Polygon;
  isAreaSet: boolean = false;
  polygonMarkers: google.maps.Marker[] = [];
  @Input() zone: any[] = [];

  //Radius
  @Input() radius: number = 1;
  radiusShape: google.maps.Circle;

  //With Marker Clusterer
  clusterer: boolean = false;
  markerClusterer: MarkerClusterer = null;


  //Tutorial
  @Input() tutorial: boolean = false;
  tutorialStep: number = 1;
  @Output() tutorialComplete = new EventEmitter<boolean>();
  secondStepSuccess = false;

  constructor(
    private geolocation: Geolocation,
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private googleMapApi: GoogleMapsApiService,
    private productService: ProductosService
  ) { }

  async ngOnInit() {

    if (!google) {
      return this.onError.emit({ error: true, message: 'ha ocurrido un error al cargar el mapa, por favor intente mas tarde.' });
    }

    if (this.for == 'product') {
      this.controls = false;
      this.BrokaControls.draggable = false;
      this.BrokaControls.showMyPositionButton = false;
      this.BrokaControls.showRadiusButton = false;
    }

    this.map = new google.maps.Map(this.googlemap.nativeElement, {
      center: this.center,
      zoom: this.BrokaControls.zoom,
      mapTypeControl: false,
      zoomControl: false,
      scaleControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      draggable: this.BrokaControls.draggable
    });

    if (!this.map) {
      this.onError.emit({ error: true, message: 'ha ocurrido un error al cargar el mapa, por favor intente mas tarde.' });
      return;
    }

    switch (this.for) {
      case 'user':
        this.clusterer = true;
        await this.displayMapForUser();
        await this.setMarkers(this.clusterer);
        this.polygon = new google.maps.Polygon({
          strokeColor: "#000000",
          fillColor: "#001c5b",
          fillOpacity: 0.35,
          strokeOpacity: 1,
          strokeWeight: 2,
        });
        this.polygon.setMap(this.map);
        break;
      case 'product':
        this.clusterer = false;
        await this.displayMapForProduct();
        await this.setMarkers(this.clusterer);
        break;
    }

    this.map.addListener('click', (e) => {
      this.onClickTheMap(e);
    });

    this.onMapLoaded.emit({ position: this.center, radius: this.radius });
    google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.googlemap.nativeElement);
  }



  async onClickTheMap(googleMapsClickEvent: google.maps.MapMouseEvent) {
    if (this.draw) {
      var path: google.maps.MVCArray<google.maps.LatLng>;
      if (this.polygon) {
        path = this.polygon.getPath();
      }

      path.push(googleMapsClickEvent.latLng);

      var polygonMarker = new google.maps.Marker({
        position: googleMapsClickEvent.latLng,
        title: "#" + path.getLength(),
        map: this.map,
        icon: '../../../assets/icon/marker.png'
      });
      this.polygonMarkers.push(polygonMarker);

      if (path.getLength() > 1) {
        this.isAreaSet = true;
      } else {
        this.isAreaSet = false;
      }
    } else {
      if (this.for == 'user') {
        const alert = await this.alertCtrl.create({
          header: '¿Cambiar tu Ubicación?',
          message: '¿Queres cambiar tu ubicacion al lugar donde pulsaste?',
          buttons: [
            {
              text: 'No'
            },
            {
              text: 'Si',
              handler: () => {
                this.clearPolygon();
                if (this.markerClusterer) {
                  this.markerClusterer.setMap(null);
                }
                this.markerClusterer = null;
                this.brokaMarkers.forEach(markers => {
                  markers.setMap(null);
                });
                this.clusterer = true;
                this.center = { lat: googleMapsClickEvent.latLng.lat(), lng: googleMapsClickEvent.latLng.lng() };
                this.map.setCenter(this.center);
                this.setUserMarker();
                this.setRadius();
              }
            }
          ]
        });
        await alert.present();
      }
    }
  }



  findByArea() {
    var area: LatLng[] = [];
    this.polygon.getPath().forEach(latLng => {
      area.push({ lat: latLng.lat(), lng: latLng.lng() });
    });

    this.onAreaSet.emit(area);
    this.draw = false;
    this.onDrawing.emit(this.draw);

    if (this.tutorialStep == 12 && this.tutorial) {
      this.tutorialStep++;
    }
  }

  ngOnChanges(changes) {
    if (changes.productsForMarkers) {
      this.clearMarkers();
      this.setMarkers(this.clusterer);
      this.zoom = 10;
      if (this.map) {
        this.map.setZoom(this.zoom);
      }
      if (
        this.radiusShape &&
        this.for === 'user' &&
        (!this.productService.filtros.radius ||
          this.productService.filtros.radius.length < 1)) {
        if (this.productsForMarkers.length > 0) {
          this.map.setCenter({ lat: this.productsForMarkers[0].address.latitude, lng: this.productsForMarkers[0].address.longitude })
        }
        this.radiusShape.setMap(null);
      }

      if (!this.productService.filtros.within || this.productService.filtros.within.length < 1 || !this.zone) {
        this.clearPolygon();
      }

      if (this.zone && this.polygon) {
        const path = this.polygon.getPath();
        path.clear();

        this.zone.forEach(latLng => {
          var coordinatess = new google.maps.LatLng(latLng.lat, latLng.lng);
          path.push(coordinatess);
        });
        if (this.productsForMarkers.length < 1) {
          console.log(this.zone[0]);
          this.map.setCenter(this.zone[0]);
        }
        this.zoom = 13;
        this.map.setZoom(this.zoom);
      };


      if (this.tutorial && this.tutorialStep == 2) {
        this.secondStepSuccess = true;
      }
    }

    if (this.productsForMarkers.length < 1 && this.zone && this.polygon) {
      const path = this.polygon.getPath();
      path.clear();

      this.zone.forEach(latLng => {
        var coordinatess = new google.maps.LatLng(latLng.lat, latLng.lng);
        path.push(coordinatess);
      });
      console.log(this.zone[0].latLng);
      this.map.setZoom(this.zone[0].latLng);
      this.zoom = 13;
      this.map.setZoom(this.zoom);
    };
  }

  async displayMapForUser() {
    try {
      var curentLocation = await (await this.geolocation.getCurrentPosition()).coords;
      if (!curentLocation) {
        if (this.authService.user.address) {
          this.center = { lat: this.authService.user.address.latitude, lng: this.authService.user.address.longitude }
          this.map.setCenter(this.center);
        }
      }
      this.center = { lat: curentLocation.latitude, lng: curentLocation.longitude }
      this.map.setCenter(this.center);
      this.setUserMarker();
      this.setRadius();
    } catch (error) {

    }
  }

  setUserMarker() {
    if (this.userMarker) {
      this.userMarker.setMap(null);
    }
    var img = this.authService.user?.profile?.image ? this.authService.user?.profile?.image : '../../assets/images/user.png';
    var brokaMarkerClass = this.googleMapApi.getBrokaMarker();
    this.userMarker = new brokaMarkerClass(
      new google.maps.LatLng(this.center.lat, this.center.lng),
      img,
      null,
      true
    );
    this.userMarker.setMap(this.map);
  }

  clearMarkers() {
    if (this.markerClusterer) {
      this.markerClusterer.setMap(null);
      this.markerClusterer = null;
    }

    if (this.brokaMarkers.length > 0) {
      this.brokaMarkers.forEach(marker => {
        marker.setMap(null);
      })
      this.brokaMarkers = [];
    }
  }

  setMarkers(markerClusterer: boolean) {
    if (this.productsForMarkers.length > 0) {
      this.productsForMarkers.forEach(product => {
        var brokaMarkerClass = this.googleMapApi.getBrokaMarker();
        var productMarker = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(product.address.latitude, product.address.longitude),
          icon: this.setIconForPropertyType(product.type.id)
        });
        if (!markerClusterer) {
          productMarker.setMap(this.map);
        }
        /* new brokaMarkerClass(
          new google.maps.LatLng(product.address.latitude, product.address.longitude),
          product.images[0].url,
          () => {
            this.showProductCard(product);
          },
          false,
        ); */
        //productMarker.setMap(this.map);
        productMarker.addListener('click', () => {
          if (this.for == 'user') {
            this.showProductCard(product, productMarker);
          }
        })
        this.brokaMarkers.push(productMarker);
        this.setIconForPropertyType(product.type);
      })
      if (markerClusterer) {
        this.markerClusterer = null;
        this.markerClusterer = new MarkerClusterer(this.map, this.brokaMarkers,
          {
            imagePath: `../../../assets/icon/markers/map-clustering`,
            calculator: (markers, numStyles) => ({ ...MarkerClusterer.CALCULATOR(markers, numStyles), text: '' }),
          });
      }
    }
  }

  setIconForPropertyType(propertyType) {
    switch (propertyType) {
      case 1:
        return {
          url: '../../../assets/icon/markers/house.png',
          scaledSize: new google.maps.Size(40, 45),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0)
        }
      case 2:
        return {
          url: '../../../assets/icon/markers/buildings.png',
          scaledSize: new google.maps.Size(40, 45),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0)
        }
      default:
        return {
          url: '../../../assets/icon/marker.png',
        }
    }

  }

  async getLocation() {

    if (this.tutorialStep == 7 && this.tutorial) {
      this.presentToast('Por favor pulsa el boton indicado.', 'danger');
      this.tutorialStep--;
      return;
    }

    if (this.tutorialStep == 8 && this.tutorial) {
      this.presentToast('No puedes hacer esto en este momento.', 'danger');
      return;
    }

    if (this.tutorialStep == 9 && this.tutorial) {
      this.presentToast('No puedes hacer esto en este momento.', 'danger');
      return;
    }

    if (this.tutorialStep == 11 && this.tutorial) {
      this.presentToast('No puedes hacer esto en este momento.', 'danger');
      this.tutorialStep--;
      return;
    }

    const loading = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Obteniendo tu ubicación',
    });
    await loading.present();
    try {
      var curentLocation = await (await this.geolocation.getCurrentPosition({ timeout: 6001 })).coords;
      this.clearPolygon();
      this.clearMarkers();
      this.center = { lat: curentLocation.latitude, lng: curentLocation.longitude }
      this.map.setCenter(this.center);
      this.map.setZoom(10);
      this.setRadius();
      this.setUserMarker();
      await loading.dismiss();
      if (this.tutorial && this.tutorialStep == 4) {
        this.tutorialStep++;
      }
    } catch (error) {
      await loading.dismiss();
      this.presentToast('ha ocurrido un error al obtener tu ubicación, por favor intente más tarde.', 'danger');
    }
  }

  clearPolygon() {
    if (this.polygon) {
      this.polygon.getPath().clear();
    }

    if (this.polygonMarkers.length > 0) {
      this.polygonMarkers.forEach(marker => {
        marker.setMap(null);
      });

      this.polygonMarkers = [];
    }

    this.isAreaSet = false;
  }

  async showProductCard(product: any, marker) {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: PropertyCardPage,
      componentProps: {
        property: product
      }
    });
    modal.present();

    modal.onWillDismiss().then(m => {
      if (m.data?.deleteProperty) {
        for (let [index, m] of this.brokaMarkers.entries()) {
          if (m === marker) {
            marker.setMap(null);
            this.brokaMarkers.splice(index, 1);
          }
        }
      }
    });
  }


  async presentToast(text, color) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000,
      color: color,
      buttons: [
        'ok'
      ]
    });
    toast.present();
  }

  displayMapForProduct() {
    this.center = { lat: this.productsForMarkers[0].address.latitude, lng: this.productsForMarkers[0].address.longitude }
    this.map.setCenter(this.center);
    this.setMarkers(this.clusterer);
  };

  setRadius() {
    if (this.radiusShape) {
      this.radiusShape.setMap(null);
    }

    this.radiusShape = new google.maps.Circle({
      /* draggable: false,
      editable: false, */
      fillColor: '#001c5b',
      fillOpacity: .35,
      radius: (this.radius * 1000),
      strokeColor: '#000000',
      center: this.center
    });

    this.radiusShape.addListener('center_changed', () => {
      this.radiusShape.setCenter(this.center);
    })

    this.radiusShape.addListener('click', () => {
      this.presentToast('ha click fuera del radio para cambiar tu ubicación', 'danger');
    });

    this.radiusShape.setMap(this.map);
    this.map.setCenter(this.center);
    this.onChangeRadius.emit({ radius: this.radius, position: this.center });

    if (this.tutorialStep == 8 && this.tutorial) {
      this.tutorialStep++;
      this.toggleRadiusControl(true);
    }
  }

  disableOptionsButton() {
    if (this.tutorial) {
      if (this.tutorialStep == 1 || this.tutorialStep == 2 || this.tutorialStep == 5) {
        return true
      }
    }
    else {
      return false;
    }
  }

  doSomething() {
    if (this.tutorialStep == 3 && this.tutorial) {
      this.tutorialStep = 4;
      return;
    }

    if (this.tutorialStep == 4 || this.tutorialStep == 7 || this.tutorialStep == 11 && this.tutorial) {
      this.tutorialStep--;
      return
    }

    if (this.tutorialStep == 6 && this.tutorial) {
      this.tutorialStep = 7;
      return;
    }

    if (this.tutorialStep == 10 && this.tutorial) {
      this.tutorialStep = 11;
      return;
    }
  }


  /*
    DISABLE AND TOGGLE RADIUS FUNCTIONS
  */

  toggleRadiusControl(toggleAnyway?) {

    /* this.radiusShape.setEditable(!this.radiusShape.getEditable()); */

    if (toggleAnyway) {
      this.showRadio = !this.showRadio;
      return;
    }

    if (this.tutorialStep == 3 || this.tutorialStep == 4 && this.tutorial) {
      this.presentToast('Por favor pulsa el boton indicado.', 'danger');
      this.tutorialStep = 3;
      return;
    }

    if (this.tutorialStep == 9 || this.tutorialStep == 8 && this.tutorial) {
      this.presentToast('No puedes hacer esto en este momento.', 'danger');
      return;
    }


    if (this.tutorialStep == 7 && this.tutorial) {
      this.tutorialStep++;
    }

    if (this.tutorialStep == 11 && this.tutorial) {
      this.presentToast('Por favor pulsa el boton indicado.', 'danger');
      this.tutorialStep--;
      return;
    }

    this.showRadio = !this.showRadio;
  }

  disableRadiusButton() {
    if (this.tutorialStep == 3 || this.tutorialStep == 4 || this.tutorialStep == 8 || this.isAreaSet) {
      return true;
    } else {
      return false;
    }
  }

  /*
    DISABLE AND TOGGLE DRAW FUNCTIONS
  */

  disableDrawButton() {
    if (this.tutorialStep == 3 || this.tutorialStep == 4) {
      return true;
    } else {
      return false;
    }
  }

  toggleDraw() {

    if (this.tutorialStep == 12) {
      return;
    }

    if (this.tutorialStep == 11) {
      this.tutorialStep++;
    }

    if (this.tutorialStep == 3 || this.tutorialStep == 4 && this.tutorial) {
      this.presentToast('Por favor pulsa el boton indicado.', 'danger');
      this.tutorialStep = 3;
      return;
    }

    if (this.tutorialStep == 7 && this.tutorial) {
      this.tutorialStep--;
      this.presentToast('Por favor pulsa el boton indicado.', 'danger');
      return;
    }

    if (this.tutorialStep == 8 || this.tutorialStep == 9 && this.tutorial) {
      this.presentToast('No puedes hacer esto en este momento.', 'danger');
      return;
    }

    this.draw = !this.draw;
    if (this.draw) {

      if (this.markerClusterer) {
        this.markerClusterer.setMap(null);
      }

      this.markerClusterer = null

      this.clearPolygon();

      if (this.brokaMarkers.length > 0) {
        this.brokaMarkers.forEach(marker => {
          marker.setMap(null);
        });

        this.brokaMarkers = [];
      }

      if (this.brokaMarkers.length > 0) {
        this.brokaMarkers.forEach(marker => {
          marker.setMap(null);
        });
      }

      if (this.userMarker) {
        this.userMarker.setMap(null);
      }
      if (this.radiusShape) {
        this.radiusShape.setMap(null);
      }

      this.map.setClickableIcons(false);
    } else {

      if (this.userMarker) {
        this.userMarker.setMap(this.map);
      }

      if (this.radiusShape) {
        this.radiusShape.setMap(this.map);
      }

      if (this.polygon) {
        this.polygon.setPath([]);
        this.polygonMarkers.forEach(polygonMarker => {
          polygonMarker.setMap(null);
        });
        this.polygonMarkers = [];
        this.isAreaSet = false;
      }

      this.map.setCenter(this.center);

      this.map.setClickableIcons(true);
    }

    this.onDrawing.emit(this.draw);

  }

  finishTutorial() {
    this.tutorialStep++;
    this.tutorial = false;
    this.tutorialComplete.emit(true);
  }

  removeRadius() {
    if (this.radius > 0) {
      this.radius--;
    }
  }

  addRadius() {
    this.radius++;
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

  /* loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = this.renderer2.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.text = ``;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      this.renderer2.appendChild(this.document.body, script);
    });
  } */
}
