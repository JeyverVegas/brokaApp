import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ContractType, ProductFilters, PropertyType, PropertyStatus, PropertyFeatures } from '../interface';
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
  showAll = true;


  rangeBetweens = {
    price: {
      min: 0,
      max: 0
    },
    size: {
      min: 0,
      max: 0
    },
    rooms: {
      min: 0,
      max: 0
    },
    bathrooms: {
      min: 0,
      max: 0
    }
  }

  valuesOfRange = {
    price: {
      lower: 0,
      upper: 0
    },
    size: {
      lower: 0,
      upper: 0
    },
    rooms: {
      lower: 0,
      upper: 0
    },
    bathrooms: {
      lower: 0,
      upper: 0
    }
  }

  valueOfType = [];


  filtros: ProductFilters = {
    name: '',
    type: [],
    contractType: [],
    status: [],
    hasAnyFeatures: [],
    realEstateAgency: [],
    sizeBetween: [0, 999999],
    roomsBetween: [0, 999999],
    bathroomsBetween: [0, 99999],
  };




  customAlertOptions: any = {
    cssClass: 'hello',
  };

  constructor(
    private modalCtrl: ModalController,
    private productosService: ProductosService,
    private smartAudio: SmartAudioService,
    private loadingCtrl: LoadingController,
    private navParams: NavParams
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'bubbles'
    });
    await loading.present();
    this.propertyTypes = await this.productosService.getPropertyType();
    this.contractTypes = await this.productosService.getContractType();
    this.propertyStatuses = await this.productosService.getPropertyStatuses();
    this.features = await this.productosService.getPropertyFeatures();
    this.rangeBetweens = this.navParams.get('minMax');
    
    if (!this.productosService.filtrado) {

      /* this.valuesOfRange.price.lower = await this.navParams.get('minMax').price.min;
      this.valuesOfRange.price.upper = await this.navParams.get('minMax').price.max;
      */
      this.valuesOfRange.size.lower = await this.navParams.get('minMax').size.min;
      this.valuesOfRange.size.upper = await this.navParams.get('minMax').size.max;

      this.valuesOfRange.rooms.lower = await this.navParams.get('minMax').rooms.min;
      this.valuesOfRange.rooms.upper = await this.navParams.get('minMax').rooms.max;

      this.valuesOfRange.bathrooms.lower = await this.navParams.get('minMax').bathrooms.min;
      this.valuesOfRange.bathrooms.upper = await this.navParams.get('minMax').bathrooms.max;

    }else{
      /* this.valuesOfRange.price.lower = await this.navParams.get('minMax').price.min;
      this.valuesOfRange.price.upper = await this.navParams.get('minMax').price.max; */

      this.valuesOfRange.size.lower = this.productosService.filtros.sizeBetween[0];
      this.valuesOfRange.size.upper = this.productosService.filtros.sizeBetween[1];

      this.valuesOfRange.rooms.lower = this.productosService.filtros.roomsBetween[0];
      this.valuesOfRange.rooms.upper = this.productosService.filtros.roomsBetween[1];
      
      this.valuesOfRange.bathrooms.lower = this.productosService.filtros.bathroomsBetween[0];
      this.valuesOfRange.bathrooms.upper = this.productosService.filtros.bathroomsBetween[1];

      this.valueOfType = this.productosService.filtros.type.map(n => String(n));

      this.filtros.contractType = this.productosService.filtros.contractType;

      this.filtros.status = this.productosService.filtros.status;

      this.filtros.hasAnyFeatures = this.productosService.filtros.hasAnyFeatures;
    }


    //console.log(this.propertyTypes);
    //console.log(this.addContractType(1, false));
    await loading.dismiss();

  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

  addContractType(event) {
    if (event.target.checked) {
      this.filtros.contractType = [Number(event.target.value), ...this.filtros.contractType];
    } else {
      this.filtros.contractType = this.filtros.contractType.filter(_id => _id != event.target.value);
    }
  }

  addStatus(event) {
    if (event.target.checked) {
      this.filtros.status = [Number(event.target.value), ...this.filtros.status];
    } else {
      this.filtros.status = this.filtros.status.filter(_id => _id != event.target.value);
    }
  }

  addFeature(event) {
    if (event.target.checked) {
      this.filtros.hasAnyFeatures = [Number(event.target.value), ...this.filtros.hasAnyFeatures];
    } else {
      this.filtros.hasAnyFeatures = this.filtros.hasAnyFeatures.filter(_id => _id != event.target.value);
    }
  }

  async aplicarFiltro() {
    this.playSound();
    //Baños
    this.filtros.bathroomsBetween[0] = this.valuesOfRange.bathrooms.lower;
    this.filtros.bathroomsBetween[1] = this.valuesOfRange.bathrooms.upper;
    //habitaciones
    this.filtros.roomsBetween[0] = this.valuesOfRange.rooms.lower;
    this.filtros.roomsBetween[1] = this.valuesOfRange.rooms.upper;
    //Tamaño
    this.filtros.sizeBetween[0] = this.valuesOfRange.size.lower;
    this.filtros.sizeBetween[1] = this.valuesOfRange.size.upper;

    this.filtros.type = this.valueOfType.map(n => Number(n));

    this.productosService.filtros = this.filtros;

    this.productosService.filtrado = true;

    this.productosService.getProducts();

    this.modalCtrl.dismiss();
  }
}
