import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ContractType, ProductFilters, PropertyType, PropertyStatus, PropertyFeatures } from '../interface';
import { AddressService } from '../servicios/address.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

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
  @ViewChild('filtrosslider', { static: true }) protected slides: IonSlides;

  slidesOpts = {
    allowTouchMove: false
  }

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

  environmentsBetween = {
    lower: 0,
    upper: 0
  }

  pricesBetween = {
    lower: 0,
    upper: 0
  }

  radiusActivated = null;

  filtros: ProductFilters = {
    contractType: [],
    type: [],
    environmentsBetween: [],
    state: 0,
    city: 0,
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

      this.environmentsBetween.lower = this.minMaxRange.environments.min;
      this.environmentsBetween.upper = this.minMaxRange.environments.max;

      this.provincies = await this.addressService.getStates();

      this.filtros.currency = this.minMaxRange.prices[0].id;

      this.radiusActivated = this.productosService.filtros.radius;
      console.log(this.minMaxRange);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      this.presentToast('Ha ocurrido un error al cargar los filtros', 'danger');
      console.log(error);

    }
  }  

  goBack() {
    this.playSound();
    this.slides.slidePrev();
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

  setEnvironmentsBetween() {
    this.playSound();
    this.filtros.environmentsBetween[0] = this.environmentsBetween.lower;
    this.filtros.environmentsBetween[1] = this.environmentsBetween.upper;
    this.slides.slideNext();
  }

  async setState() {
    if (this.filtros.state != 0) {
      const loading = await this.loadingCtrl.create({
        spinner: 'lines',
        message: 'Cargando partidos...'
      });
      await loading.present();
      try {
        this.partidos = await this.addressService.getCities(this.filtros.state);
        await loading.dismiss();
      } catch (error) {
        console.log(error);
        await loading.dismiss();
        this.presentToast('Ha ocurrido un error al cargar los partidos.', 'danger');
      }
    } else {
      this.filtros.city = 0;
      this.partidos = [];
    }
  }

  setStateCity() {
    this.playSound();
    this.slides.slideNext();
  }

  setCurrency() {
    const currency = this.minMaxRange.prices.find(price => price.id == this.filtros.currency);
    
    this.rangesPrices.min = parseInt(currency.min_price, 0);
    this.rangesPrices.max = parseInt(currency.max_price, 0);   

    this.pricesBetween.lower = parseInt(currency.min_price, 0);
    this.pricesBetween.upper = parseInt(currency.max_price, 0);

    this.steps = currency.max_price / 100;
    console.log(this.steps);
  }

  async setPricesBetween(){
    this.filtros.priceBetween[0] = this.pricesBetween.lower;
    this.filtros.priceBetween[1] = this.pricesBetween.upper;
    this.productosService.filtros = this.filtros;    
    if(await this.modalCtrl.getTop()){
      this.productosService.getProducts();    
      this.modalCtrl.dismiss();
    }else{
      this.router.navigateByUrl('/tabs', {replaceUrl: true});
    }    
  }

  async aplicarFiltro() {

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
