import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { City, ContractType, ProductFilters, PropertyType, State } from '../interface';
import { AddressService } from '../servicios/address.service';
import { ProductosService } from '../servicios/productos.service';

@Component({
  selector: 'app-filtros2',
  templateUrl: './filtros2.page.html',
  styleUrls: ['./filtros2.page.scss'],
})
export class Filtros2Page implements OnInit {

  showSegment: 'filtros' | 'guardados' = 'filtros';
  @Input() commingFromMap: boolean = false;

  provincies: State[] = [];
  cities: City[] = [];
  showCities = false;
  loadingCities: boolean = false;
  contractTypes: ContractType[] = [];
  errorContractTypes: boolean = false;

  propertyTypes: PropertyType[] = [];
  errorpropertyTypes: boolean = false;

  rooms = [1];

  cityShape = null;

  optioValues = Array.from(Array(6));

  currencies = [];
  errorLoadingCurrencies: boolean = false;

  filtros: ProductFilters = {
    city: [],
    hasAnyFeatures: [],
    sizeBetween: [],
    state: [],
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
  selectedType: PropertyType = null;
  selectedCurrency = null;
  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private productosService: ProductosService,
    private loadingCtrl: LoadingController,
    private addressService: AddressService,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {

    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'cargando informacion...',
      cssClass: 'custom-loading custom-loading-primary',
    });

    try {
      loading.present();

      const [contractTypes, propertyTypes, minMaxRange] = await Promise.all([
        this.productosService.getContractType(),
        this.productosService.getPropertyType(),
        this.productosService.getFiltersRange()
      ]);

      this.contractTypes = contractTypes;
      if (this.contractTypes.length < 1) {
        this.errorContractTypes = true;
        loading.dismiss();
        return;
      }

      console.log(this.contractTypes);

      this.propertyTypes = propertyTypes;
      if (this.propertyTypes.length < 1) {
        this.errorpropertyTypes = true;
        loading.dismiss();
        return;
      }

      this.currencies = minMaxRange.prices;
      if (this.currencies.length < 1) {
        this.errorLoadingCurrencies = true;
        loading.dismiss();
        return;
      }

      loading.dismiss();

      console.log(this.currencies);

      if (Object.keys(this.productosService.filtros).length > 1) {
        this.filtros = this.productosService.filtros;

        if (this.filtros.currency) {
          this.selectedCurrency = this.currencies.find(currency => currency.id == this.filtros.currency);
        }

        if (!this.productosService.filtros.rooms) {
          this.filtros.rooms = []
        }

        if (!this.productosService.filtros.bathrooms) {
          this.filtros.bathrooms = []
        }

        if (!this.filtros.type) {
          this.filtros.type = [];
        }

        if (this.filtros.priceBetween?.length < 1 || !this.filtros.priceBetween) {
          this.filtros.priceBetween = [null, null];
        }

        if (!this.productosService.filtros.contractType) {
          this.filtros.contractType = [];
        }
      }

      console.log(this.filtros)

    } catch (err) {
      loading.dismiss();
      if (err.message == "Tiempo de espera excedido.") {
        this.alertCtrl.create({
          header: 'Error de conexión',
          message: err,
          buttons: [
            {
              text: 'OK'
            }
          ]
        }).then(a => {
          a.present();
          a.onWillDismiss().then(_ => {
            this.modalCtrl.dismiss();
          })
        });
      }
    }
  }

  onItemSelect(event) {
    console.log(event);
  }

  changeContractType() {
    this.selectedContract = this.contractTypes.find(contract => contract.id == this.filtros.contractType[0]);
  }

  changePropertyType() {
    this.selectedType = this.propertyTypes.find(type => type.id == this.filtros.type[0]);
  }

  clearFilters() {
    this.filtros = {
      city: [],
      hasAnyFeatures: [],
      sizeBetween: [],
      state: [],
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

    if (this.commingFromMap) {
      this.filtros.per_page = 999999999999999;
    } else {
      this.filtros.per_page = 10;
    }

    this.productosService.filtros = this.filtros;

    console.log(this.productosService.filtros);
    this.productosService.getProducts();

    this.modalCtrl.dismiss();
  }

  handleRoomsChange(values: number[]) {
    this.filtros.rooms = values;
  }

  removeRooms(room) {
    for (let [index, r] of this.filtros.rooms.entries()) {
      if (r === room) {
        this.filtros.rooms.splice(index, 1);
        break;
      }
    }
  }

  handleBathroomsChange(values) {
    this.filtros.bathrooms = values;
  }

  removeBathrooms(bathroom: number) {
    for (let [index, b] of this.filtros.bathrooms.entries()) {
      if (b === bathroom) {
        this.filtros.bathrooms.splice(index, 1);
        break;
      }
    }
  }

  removeRadius() {
    this.filtros.radius = null;
  }

  removeAreaCustom() {
    this.filtros.within = null;
  }

  removeState() {
    this.filtros.state = [];
    this.filtros.city = [];
  }

  removeCity() {
    this.filtros.city = [];
  }

  removeContract() {
    this.filtros.contractType = [];
  }

  removeType() {
    this.filtros.type = [];
  }

  removePrice() {
    this.filtros.priceBetween[0] = null;
    this.filtros.priceBetween[1] = null;
  }

  removeCurrency() {
    this.filtros.currency = null;
    this.selectedCurrency = null;
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

  setCurrency(currency) {
    console.log(currency);
    this.selectedCurrency = currency;
  }

  removeAddress(address) {
    for (let [index, a] of this.filtros.city.entries()) {
      if (a.id === address.id) {
        this.filtros.city.splice(index, 1);
        break;
      }
    }
  }

  async findCities(event: string) {
    if (event.length > 0) {
      this.cities = await this.addressService.getCities(null, event)
    } else {
      this.cities = [];
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
