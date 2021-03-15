import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { googleMapsControlOpts, LatLng, } from 'src/app/interface';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { } from 'googlemaps';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { PropertyCardPage } from 'src/app/property-card/property-card.page';
import { SmartAudioService } from 'src/app/servicios/smart-audio.service';
import { GoogleMapsApiService } from 'src/app/servicios/google-maps-api.service';

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

  //Radius
  @Input() radius: number = 1;
  radiusShape: google.maps.Circle;

  constructor(
    private geolocation: Geolocation,
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
    private googleMapApi: GoogleMapsApiService
  ) { }

  async ngOnInit() {
    //var loadedMap = await this.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDkAJA-uOdmLgb0WSrMePZp4pvA4s6fT7w&libraries=geometry&libraries=drawing');

    //console.log(loadedMap);

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
        await this.displayMapForUser();
        await this.setMarkers();
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
        await this.displayMapForProduct();
        await this.setMarkers();
        break;
    }

    this.map.addListener('click', (e) => {
      this.onClickTheMap(e);
    });

    this.onMapLoaded.emit({ position: this.center, radius: this.radius });
    google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.googlemap.nativeElement);
  }

  toggleDraw() {
    this.draw = !this.draw;
    if (this.draw) {

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
  }

  ngOnChanges(changes) {
    if (changes.productsForMarkers) {
      this.clearMarkers();
      this.setMarkers();
    }
  }

  async displayMapForUser() {
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
    if (this.brokaMarkers.length > 0) {
      this.brokaMarkers.forEach(marker => {
        marker.setMap(null);
      })
      this.brokaMarkers = [];
    }
  }

  setMarkers() {
    if (this.productsForMarkers.length > 0) {
      this.productsForMarkers.forEach(product => {
        var brokaMarkerClass = this.googleMapApi.getBrokaMarker();
        var productMarker = new brokaMarkerClass(
          new google.maps.LatLng(product.address.latitude, product.address.longitude),
          product.images[0].url,
          () => {
            this.showProductCard(product);
          },
          false,
        );
        productMarker.setMap(this.map);
        this.brokaMarkers.push(productMarker);
      })
    }
  }

  async getLocation() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Obteniendo tu ubicación',
    });
    await loading.present();
    try {
      var curentLocation = await (await this.geolocation.getCurrentPosition({ timeout: 6001 })).coords;
      this.clearPolygon();
      this.center = { lat: curentLocation.latitude, lng: curentLocation.longitude }
      this.map.setCenter(this.center);
      this.setRadius();
      this.setUserMarker();
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      this.presentToast('ha ocurrido un error al obtener tu ubicación, porfavor intente más tarde.', 'danger');

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

  async showProductCard(product: any) {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: PropertyCardPage,
      componentProps: {
        property: product
      }
    });
    modal.present();
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
    this.setMarkers();
  };

  setRadius() {
    if (this.radiusShape) {
      this.radiusShape.setMap(null);
    }

    this.radiusShape = new google.maps.Circle({
      fillColor: '#001c5b',
      fillOpacity: .35,
      radius: (this.radius * 1000),
      strokeColor: '#000000',
      center: this.center
    });

    this.radiusShape.setMap(this.map);
    this.onChangeRadius.emit({ radius: this.radius, position: this.center });
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
