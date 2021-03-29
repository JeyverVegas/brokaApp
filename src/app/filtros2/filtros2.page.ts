import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ContractType, ProductFilters, PropertyType } from '../interface';
import { ProductosService } from '../servicios/productos.service';

@Component({
  selector: 'app-filtros2',
  templateUrl: './filtros2.page.html',
  styleUrls: ['./filtros2.page.scss'],
})
export class Filtros2Page implements OnInit {

  showSegment = 'filtros';

  contractTypes: ContractType[] = [];
  errorContractTypes: boolean = false;

  propertyTypes: PropertyType[] = [];
  errorpropertyTypes: boolean = false;

  rooms = [1];

  optioValues = Array.from(Array(6));

  currencies = [];
  errorLoadingCurrencies: boolean = false;

  filtros: ProductFilters = {
    city: 'todas',
    hasAnyFeatures: [],
    sizeBetween: [],
    state: 'todas',
    contractType: [],
    type: [null],
    currency: null,
    environments: [],
    environmentsBetween: [],
    bathrooms: [],
    bathroomsBetween: [],
    rooms: [],
    roomsBetween: [],
    priceBetween: [null, null],
  };

  selectedContract: ContractType = null;
  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private productosService: ProductosService,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {

    if (Object.keys(this.productosService.filtros).length > 1) {
      this.filtros = this.productosService.filtros;
      if (!this.productosService.filtros.rooms) {
        this.filtros.rooms = []
      }

      if (!this.productosService.filtros.bathrooms) {
        this.filtros.bathrooms = []
      }

      if (!this.filtros.type) {
        this.filtros.type = [];
      }
    }

    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'cargando informacion...',
      duration: 10000
    });

    loading.onDidDismiss().then(() => {
      if (this.errorContractTypes || this.errorpropertyTypes || this.errorLoadingCurrencies) {
        console.log(this.contractTypes, this.currencies, this.propertyTypes)
        this.presentToast('Ha ocurrido un error al cargar los filtros, por favor intente mas tarde.', 'danger');
        this.modalCtrl.dismiss();
      }
    })

    try {
      loading.present();
      this.contractTypes = await this.productosService.getContractType();
      if (this.contractTypes.length < 1) {
        this.errorContractTypes = true;
        loading.dismiss();
        return;
      }

      console.log(this.contractTypes);

      this.propertyTypes = await this.productosService.getPropertyType();
      if (this.propertyTypes.length < 1) {
        this.errorpropertyTypes = true;
        loading.dismiss();
        return;
      }

      this.currencies = await (await this.productosService.getFiltersRange()).prices;
      if (this.currencies.length < 1) {
        this.errorLoadingCurrencies = true;
        loading.dismiss();
        return;
      }

      loading.dismiss();

      console.log(this.currencies);

    } catch (err) {
      loading.dismiss();
      console.log(err);
    }
  }

  changeContractType() {
    this.selectedContract = this.contractTypes.find(contract => contract.id == this.filtros.contractType[0]);
  }

  clearFilters() {
    this.filtros = {
      city: 'todas',
      hasAnyFeatures: [],
      sizeBetween: [],
      state: 'todas',
      contractType: [],
      type: [],
      currency: null,
      environmentsBetween: [],
      bathroomsBetween: [],
      rooms: [],
      bathrooms: [],
      environments: [],
      roomsBetween: [],
      priceBetween: [null, null]
    };
  }

  closeModal() {

    if (!this.filtros.priceBetween[0]) {
      this.filtros.priceBetween[0] = 0;
    }

    if (!this.filtros.priceBetween[1]) {
      this.filtros.priceBetween[1] = 0;
    }

    this.productosService.filtros = this.filtros;
    this.productosService.getProducts();
    this.modalCtrl.dismiss();
  }

  handleRoomsChange(values: number[]) {
    this.filtros.rooms = values;
  }

  handleBathroomsChange(values) {
    this.filtros.bathrooms = values;
  }

  removeRadius() {
    this.filtros.radius = null;
  }

  removeState() {
    this.filtros.state = 'todas';
    this.filtros.city = 'todas';
  }

  removeCity() {
    this.filtros.city = 'todas';
  }

  removeContract() {
    this.filtros.contractType = [];
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
