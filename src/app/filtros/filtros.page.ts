import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSlides, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ContractType, ProductFilters, PropertyType, PropertyStatus, PropertyFeatures, googleMapsControlOpts, City } from '../interface';
import { AddressService } from '../servicios/address.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { } from 'googlemaps';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.page.html',
  styleUrls: ['./filtros.page.scss'],
})
export class FiltrosPage implements OnInit {

  propertyTypes: PropertyType[] = [];
  contractTypes: ContractType[] = [];
  propertyStatuses: PropertyStatus[] = [];
  features: PropertyFeatures[] = [];
  cities = [];
  inmuebles: any[] = [];
  @ViewChild('filtrosslider', { static: true }) protected slides: IonSlides;

  radius = 10;

  BrokaControls: googleMapsControlOpts = {
    zoom: 10,
    showMyPositionButton: true,
    showRadiusButton: true
  }

  activeIndex: number = null;

  firtsRender = false;

  slidesOpts = {
    allowTouchMove: false,
    //autoHeight: true
  }

  comeFromSlide: number = null;

  currencies = [];

  optioValues = Array.from(Array(6));

  minMaxRange: any = {
    environments: {
      min: 0,
      max: 0
    }
  };

  rangesPrices = {
    min: 0,
    max: 0
  }

  steps = 1;

  pricesBetween = {
    lower: 0,
    upper: 0
  }

  canAcceptMap: boolean = true;

  positionAndRadius = [null, null, null];

  radiusActivated = null;

  filtros: ProductFilters = {
    city: [],
    hasAnyFeatures: [],
    sizeBetween: [],
    state: [],
    contractType: [],
    type: [],
    currency: null,
    environmentsBetween: [],
    bathroomsBetween: [],
    roomsBetween: [],
    priceBetween: [null, null]
  };

  isProvinciesLoad: boolean = false;

  isLoadingFirstRenderData: boolean = false;

  firstRender: boolean = false;
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private productosService: ProductosService,
    private smartAudio: SmartAudioService,
    private loadingCtrl: LoadingController,
    private addressService: AddressService,
    private router: Router,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Cargando...',
      cssClass: 'custom-loading custom-loading-primary',
    });

    try {
      await loading.present();
      const [contractTypes, propertyTypes, minMaxRange] = await Promise.all([
        this.productosService.getContractType(),
        this.productosService.getPropertyType(),
        this.productosService.getFiltersRange()
      ]);

      this.contractTypes = contractTypes;
      this.propertyTypes = propertyTypes;
      this.minMaxRange = minMaxRange;

      this.currencies = this.minMaxRange.prices;
      this.radiusActivated = this.productosService.filtros.radius;
      this.isLoadingFirstRenderData = true;
      await loading.dismiss();
    } catch (error) {
      console.log(error.message);
      if (error.message == "Tiempo de espera excedido.") {
        this.alertCtrl.create({
          header: 'Error de conexión',
          message: error,
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).then(a => {
          a.present();
          a.onWillDismiss().then(_ => {
            this.ngOnInit();
          })
        });
      }
      await loading.dismiss();
    }
    this.firstRender = true;
  }

  async reloadData() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Cargando...',
      duration: 10000
    });

    let alert: any = null;

    loading.onWillDismiss().then(() => {
      if (!this.isLoadingFirstRenderData) {
        alert = this.presentAlert();
      }
    })

    try {
      await loading.present();
      this.contractTypes = await this.productosService.getContractType();
      this.propertyTypes = await this.productosService.getPropertyType();
      this.minMaxRange = await this.productosService.getFiltersRange();
      this.currencies = this.minMaxRange.prices;
      console.log(this.minMaxRange);
      this.radiusActivated = this.productosService.filtros.radius;
      this.isLoadingFirstRenderData = true;
      alert.dismiss();
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      console.log(error);
    }
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Error de conexión',
      message: 'ha ocurrido un error de conexion',
      backdropDismiss: false,
      buttons: [
        {
          text: 'reintentar',
          handler: () => {
            this.reloadData();
          }
        }
      ]
    });
    alert.present();
    return alert;
  }

  goBack(index?: number, comeFrom?: boolean) {
    if (index) {
      this.slides.slideTo(index);
    } else {
      this.slides.slidePrev();
    }

    if (comeFrom) {
      this.slides.slideTo(this.comeFromSlide);
    }
    this.playSound();
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

  async goToAddress() {
    this.filtros.per_page = 10;
    this.filtros.city = [];
    this.filtros.state = [];
    this.filtros.radius = null;
    this.filtros.within = null;
    this.productosService.filtros = this.filtros;
    this.slideNext();
  }

  setcontractType(id: number) {
    this.playSound();
    this.filtros.contractType[0] = id;
    this.slides.slideNext();
  }

  setpropertyType(id: number) {
    this.playSound();
    this.filtros.type[0] = id;
    this.slides.slideNext();
  }

  handleEnviromentsChange(event) {
    this.playSound();
    this.filtros.environments = event;
  }

  async goToMap() {
    this.filtros.per_page = 99999999999;
    this.filtros.city = [];
    this.filtros.state = [];
    this.productosService.filtros = this.filtros;
    this.loadProperties(this.positionAndRadius);
    /* this.inmuebles = await (await this.productosService.getProducts()).getValue(); */
    this.slideNext((2 + await this.slides.getActiveIndex()));
  }

  async changeRadius(event: any) {
    if (this.firtsRender) {
      this.productosService.filtros.within = null;
      this.productosService.filtros.city = null;
      this.productosService.filtros.state = null;
      this.positionAndRadius = event;
      this.loadProperties(event);
    }
  }

  drawing(event) {
    this.canAcceptMap = !event;
  }

  setRadiusAndPosition(event) {
    this.positionAndRadius = event;
  }

  async loadProperties(event) {
    this.productosService.filtros.radius = [event.radius, event.position.lat, event.position.lng];
    console.log(event);
    this.inmuebles = (await this.productosService.getProducts()).getValue();

    if (!this.inmuebles) {
      return;
    }

    this.firtsRender = true;
  }

  async loadProductsByArea(event) {
    this.productosService.filtros.within = event;
    this.productosService.filtros.radius = null;
    this.productosService.filtros.city = null;
    this.productosService.filtros.state = null;
    this.inmuebles = (await this.productosService.getProducts()).getValue();
    console.log(event);
  }

  async slideNext(index?: number) {
    this.comeFromSlide = await this.slides.getActiveIndex();
    if (index) {
      this.slides.slideTo(index);
    } else {
      this.slides.slideNext();
    }
  }


  async findCities(event: string) {
    if (event.length > 0) {
      this.cities = await this.addressService.getCities(null, event)
    } else {
      this.cities = [];
    }
  }

  async setAddress(event: City[]) {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Cargando...',
      cssClass: 'custom-loading custom-loading-primary',
    });
    loading.present();

    try {
      let city = await this.addressService.getCityById(event[0].id);
      this.filtros.city = [city];
      this.filtros.radius = null;
      this.filtros.within = null;
      loading.dismiss();
    } catch (error) {
      loading.dismiss();
    }
  }

  isAddressSet() {
    if (this.filtros.city && this.filtros.city.length > 0) {
      return true
    }

    return false;
  }



  setCurrency() {
    const currency = this.minMaxRange.prices.find(price => price.id == this.filtros.currency);

    this.rangesPrices.min = parseInt(currency.min_price, 0);
    this.rangesPrices.max = parseInt(currency.max_price, 0);

    this.pricesBetween.lower = parseInt(currency.min_price, 0);
    this.pricesBetween.upper = parseInt(currency.max_price, 0);

    this.steps = currency.max_price / 100;
  }

  async setPricesBetween() {
    this.productosService.filtros = this.filtros;
    if (await this.modalCtrl.getTop()) {
      this.productosService.getProducts();
      this.modalCtrl.dismiss();
    } else {
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }
  }

  tutorialComplete(event) {
    console.log(event);
  }

  async setActiveIndex() {
    this.activeIndex = await this.slides.getActiveIndex();
    console.log(this.activeIndex);
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
