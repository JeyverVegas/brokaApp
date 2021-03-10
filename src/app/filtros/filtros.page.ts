import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ContractType, ProductFilters, PropertyType, PropertyStatus, PropertyFeatures, googleMapsControlOpts } from '../interface';
import { AddressService } from '../servicios/address.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
declare var google: any;

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
  provincies = [];
  partidos = [];
  inmuebles: any[] = [];
  @ViewChild('filtrosslider', { static: true }) protected slides: IonSlides;

  slidesOpts = {
    allowTouchMove: false
  }

  comeFromSlide: number = null;

  BrokaControls: googleMapsControlOpts = {
    showMyPositionButton: false,
    showRadiusButton: false
  }

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

  radiusActivated = null;

  filtros: ProductFilters = {
    city: 'todas',
    hasAnyFeatures: [],
    sizeBetween: [],
    state: 'todas',
    contractType: [],
    type: [],
    currency: null,
    environmentsBetween: [],
    bathroomsBetween: [],
    roomsBetween: [],
    priceBetween: [null, null]
  };

  constructor(
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
      message: 'Cargando...'
    });
    try {
      await loading.present();
      this.contractTypes = await this.productosService.getContractType();
      this.propertyTypes = await this.productosService.getPropertyType();
      this.minMaxRange = await this.productosService.getFiltersRange();
      this.currencies = this.minMaxRange.prices;
      console.log(this.minMaxRange);
      this.provincies = await this.addressService.getStates();
      this.radiusActivated = this.productosService.filtros.radius;
      /* var map = new google.maps.Map(this.mapa.nativeElement, {
        center: { lat: -34.603722, lng: -58.381592 },
        zoom: 10,
        mapTypeControl: false,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: false
      }); */
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      this.presentToast('Ha ocurrido un error al cargar los filtros', 'danger');
      console.log(error);

    }
  }

  goBack(index: number, comeFrom: boolean) {
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
    this.filtros.city = 'todas';
    this.filtros.state = 'todas';
    this.productosService.filtros = this.filtros;
    this.inmuebles = await (await this.productosService.getProducts()).getValue();
    this.slideNext((2 + await this.slides.getActiveIndex()));
  }

  async slideNext(index: number) {
    this.comeFromSlide = await this.slides.getActiveIndex();
    if (index) {
      this.slides.slideTo(index);
    } else {
      this.slides.slideNext();
    }
  }

  async setState() {
    if (this.filtros.state != 'todas') {
      const loading = await this.loadingCtrl.create({
        spinner: 'lines',
        message: 'Cargando partidos...'
      });
      await loading.present();
      try {
        let provincy = this.provincies.find(provincy => provincy.name == this.filtros.state);
        console.log(provincy);
        this.partidos = await this.addressService.getCities(provincy.id);
        await loading.dismiss();
      } catch (error) {
        console.log(error);
        await loading.dismiss();
        this.presentToast('Ha ocurrido un error al cargar los partidos.', 'danger');
      }
    } else {
      this.filtros.city = 'todas';
      this.partidos = [];
    }
  }

  setStateCity() {
    this.playSound();
    this.slideNext(6);
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
    this.filtros.priceBetween[0] = this.pricesBetween.lower;
    this.filtros.priceBetween[1] = this.pricesBetween.upper;
    this.productosService.filtros = this.filtros;
    if (await this.modalCtrl.getTop()) {
      this.productosService.getProducts();
      this.modalCtrl.dismiss();
    } else {
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }
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
