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
  errorpropertyTypes: boolean = true;

  optioValues = Array.from(Array(6));

  currencies = [];

  filtros: ProductFilters = {
    city: 0,
    hasAnyFeatures: [],
    sizeBetween: [],
    state: 0,
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
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {

    if (Object.keys(this.productosService.filtros).length > 1) {
      this.filtros = this.productosService.filtros;
    }

    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'cargando informacion...',
      duration: 10000
    });

    loading.onDidDismiss().then(() => {
      if (this.contractTypes.length < 1 || this.currencies.length < 1 || this.propertyTypes.length < 1) {
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

  clearFilters() {
    this.filtros = {
      city: null,
      hasAnyFeatures: [],
      sizeBetween: [],
      state: null,
      contractType: [],
      type: [],
      currency: null,
      environmentsBetween: [],
      bathroomsBetween: [],
      roomsBetween: [],
      priceBetween: [null, null]
    };
  }

  closeModal() {

    if (this.filtros.environmentsBetween.length > 0) {

      this.filtros.environmentsBetween[1] = this.filtros.environmentsBetween[0];
      if (this.filtros.environmentsBetween[0] == 6) {
        this.filtros.environmentsBetween[1] = 9999;
      }
    }

    if (this.filtros.roomsBetween.length > 0) {
      this.filtros.roomsBetween[1] = this.filtros.roomsBetween[0];
      if (this.filtros.roomsBetween[0] == 6) {
        this.filtros.roomsBetween[1] = 9999;
      }
    }

    if (this.filtros.bathroomsBetween.length > 0) {
      this.filtros.bathroomsBetween[1] = this.filtros.bathroomsBetween[0];
      if (this.filtros.bathroomsBetween[0] == 6) {
        this.filtros.bathroomsBetween[1] = 9999;
      }
    }

    this.productosService.filtros = this.filtros;
    this.productosService.getProducts();
    this.modalCtrl.dismiss();
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
