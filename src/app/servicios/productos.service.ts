import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { ContractType, ProductFilters, ProductRelationships, PropertyFeatures, PropertyType } from '../interface'
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private productos = new BehaviorSubject([]);
  private total = new BehaviorSubject(0);
  private next = null;
  filtros: ProductFilters = {};
  filtrado = false;
  loading = null;

  alert = null;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  onLoad() {
    this.authService.isAuthenticated.subscribe(isLogin => {
      if (!isLogin) {
        this.filtros.type = null;
        this.filtros.contractType = null;
        this.filtros.sizeBetween = null;
        this.filtros.roomsBetween = null;
        this.filtros.bathroomsBetween = null;
        this.filtros.environmentsBetween = null;
        this.filtros.status = null;
        this.filtros.hasAnyFeatures = null;
        this.filtros.realEstateAgency = null;
        this.filtros.radius = null;
        this.filtros.city = null;
        this.filtros.state = null;
        this.filtros.priceBetween = null;
        this.filtros.currency = null;
        this.filtros.within = null;
        return;
      }

    })
  }

  getFiltersRange(): Promise<any> {
    return new Promise((resolve) => {
      this.http.get(this.authService.api + '/ranges', {
        headers: this.authService.authHeader
      }).subscribe((response: any) => {
        resolve(response);
      }, error => {
        alert(JSON.stringify(error));
      })
    });
  }

  getPropertyType(): Promise<PropertyType[]> {
    return new Promise((resolve) => {
      this.http.get(this.authService.api + '/property-types', {
        headers: this.authService.authHeader
      }).subscribe((response: { data: PropertyType[] }) => {
        resolve(response.data);
      }, error => {
        alert(JSON.stringify(error));
      })
    });
  }

  getContractType(): Promise<ContractType[]> {
    return new Promise((resolve) => {
      this.http.get(this.authService.api + '/contract-types', {
        headers: this.authService.authHeader
      }).subscribe((response: { data: ContractType[] }) => {
        resolve(response.data);
      }, error => {
        alert(JSON.stringify(error));
      })
    });
  }

  getPropertyStatuses(): Promise<PropertyType[]> {
    return new Promise((resolve) => {
      this.http.get(this.authService.api + '/property-statuses', {
        headers: this.authService.authHeader
      }).subscribe((response: { data: PropertyType[] }) => {
        resolve(response.data);
      }, error => {
        alert(JSON.stringify(error));
      })
    });
  }

  getPropertyFeatures(): Promise<PropertyFeatures[]> {
    return new Promise((resolve) => {
      this.http.get(this.authService.api + '/property-features', {
        headers: this.authService.authHeader
      }).subscribe((response: { data: PropertyFeatures[] }) => {
        resolve(response.data);
      }, error => {
        alert(JSON.stringify(error));
      })
    });
  }

  uploadSearch(search) {
    return this.http.post(this.authService.api + '/profile/search-parameters', search, {
      headers: this.authService.authHeader
    }).toPromise();
  }

  downloadSearch() {
    return this.http.get(this.authService.api + '/profile/search-parameters', {
      headers: this.authService.authHeader
    }).toPromise();
  }

  getOneProduct(propertyID: number) {
    return this.http.get(this.authService.api + '/properties/' + propertyID, {
      headers: this.authService.authHeader,
      params: {
        include: this.getProductRelationships([])
      }
    }).toPromise();
  }

  async getProducts(): Promise<BehaviorSubject<any[]>> {
    let success = null;

    this.loading = await this.loadingCtrl.create({
      message: 'Cargando propiedades...',
      spinner: 'bubbles',
      duration: 10000
    })

    this.loading.onWillDismiss().then(() => {
      if (!success) {
        this.presentAlert();
      }
    })

    try {
      this.loading.present();
      var response: any = await this.http.get(this.authService.api + '/properties' + this.getFilters(), {
        headers: this.authService.authHeader,
        params: {
          include: this.getProductRelationships()
        }
      }).toPromise();

      this.productos.next(response.data);
      this.total.next(response.meta.total);
      this.next = response.links.next;
      success = true;
      await this.loading.dismiss();
      if (this.alert) {
        this.alert.dismiss();
      }
      console.log(response.data);
      return this.productos;
    } catch (error) {
      console.log(error);
      await this.loading.dismiss();
      this.presentToast('Ha ocurrido un error al obtener los inmuebles, por favor intente mas tarde.', 'danger');
    }
  }

  getTotal() {
    return this.total;
  }

  getNext() {
    return this.next;
  }

  getFilters() {
    var queryString = '?';
    try {

      //Type (House, Apartment, Etc)      
      if (this.filtros.type && this.filtros.type.length > 0 && this.filtros.type[0] !== null) {
        queryString = queryString + 'filter[type]=' + this.filtros.type.join(',') + '&';
      }

      //Contract (Rent, Sell, Etc)
      if (this.filtros.contractType && this.filtros.contractType.length > 0) {
        queryString = queryString + 'filter[contract_type]=' + this.filtros.contractType.join(',') + '&';
      }

      //Size (M2)
      if (this.filtros.sizeBetween && this.filtros.sizeBetween.length >= 2) {
        queryString = queryString + 'filter[size_between]=' + this.filtros.sizeBetween.join(',') + '&';
      }

      //Rooms
      if (this.filtros.roomsBetween && this.filtros.roomsBetween.length >= 2) {
        queryString = queryString + 'filter[rooms_between]=' + this.filtros.roomsBetween.join(',') + '&';
      }

      if (this.filtros.rooms && this.filtros.rooms.length > 0) {
        queryString = queryString + 'filter[rooms_in]=' + this.filtros.rooms.join(',') + '&';
      }

      //Bathrooms
      if (this.filtros.bathroomsBetween && this.filtros.bathroomsBetween.length >= 2) {
        queryString = queryString + 'filter[bathrooms_between]=' + this.filtros.bathroomsBetween.join(',') + '&';
      }

      if (this.filtros.bathrooms && this.filtros.bathrooms.length > 0) {
        queryString = queryString + 'filter[bathrooms_in]=' + this.filtros.bathrooms.join(',') + '&';
      }

      //Enviroments
      if (this.filtros.environmentsBetween && this.filtros.environmentsBetween.length >= 2) {
        queryString = queryString + 'filter[environments_between]=' + this.filtros.environmentsBetween.join(',') + '&';
      }

      if (this.filtros.environments && this.filtros.environments.length > 0) {
        queryString = queryString + 'filter[environments_in]=' + this.filtros.environments.join(',') + '&';
      }

      //Status
      if (this.filtros.status && this.filtros.status.length > 0) {
        queryString = queryString + 'filter[status]=' + this.filtros.status.join(',') + '&';
      }

      //Feature
      if (this.filtros.hasAnyFeatures && this.filtros.hasAnyFeatures.length > 0) {
        queryString = queryString + 'filter[has_any_features]=' + this.filtros.hasAnyFeatures.join(',') + '&';
      }

      //Agency
      if (this.filtros.realEstateAgency && this.filtros.realEstateAgency.length > 0) {
        queryString = queryString + 'filter[real_estate_agency]=' + this.filtros.realEstateAgency.join(',') + '&';
      }

      //Radius
      if (this.filtros.radius) {
        queryString = queryString + 'filter[radius]=' + this.filtros.radius.join(',') + '&';
      }

      //Address

      //STATE
      if (this.filtros.state && this.filtros.state.length > 0) {
        queryString = queryString + 'filter[state]=' + this.filtros.state.map(state => state.id).join(',') + '&';
      }

      //CITY
      if (this.filtros.city && this.filtros.city.length > 0) {
        queryString = queryString + 'filter[city]=' + this.filtros.city.map(city => city.id).join(',') + '&';
      }

      //Price
      if (this.filtros.currency && this.filtros.priceBetween) {
        queryString = queryString + 'filter[price_between]=' + this.filtros.currency + ',' + this.filtros.priceBetween.join(',') + '&';
      }

      if (this.filtros.within && this.filtros.within.length > 1) {
        queryString = queryString + 'filter[within]=' + this.filtros.within.reduce((acum, coord) => `${acum}${coord.lat}|${coord.lng},`, '')
          .concat(`${this.filtros.within[0].lat}|${this.filtros.within[0].lng}`);

        queryString = queryString + '&';
      }

      //Products for Page
      if (this.filtros.per_page) {
        queryString = queryString + 'per_page=' + this.filtros.per_page;
      } else {
        queryString = queryString + 'per_page=10';
      }

      //queryString = queryString.slice(0, -1);

      console.log(queryString);

      return queryString;
    } catch (error) {
      this.presentToast('Ha ocurrido un error', 'danger');
      console.log(error);
    }
  }



  getProductsFavorites(relationships?: Array<ProductRelationships>) {
    if (typeof relationships === 'undefined' || relationships === null) {
      relationships = [];
    }

    return new Promise<[]>((resolve) => {
      this.http.get(this.authService.api + '/properties/favorites', {
        headers: this.authService.authHeader,
        params: {
          include: this.getProductRelationships(relationships)
        }
      }).subscribe((response: { data: any }) => {
        resolve(response.data);
      }, e => {
        console.log(e);
      });
    });
  }

  private getProductRelationships(aditionalRels?: Array<ProductRelationships>) {
    const relationships: Array<ProductRelationships> = ['images', 'prices.currency', 'address.state', 'address.city', 'features', 'type', 'status', 'favorite_to_count', 'realEstateAgency'];
    if (aditionalRels) {
      relationships.push(...aditionalRels);
    }
    return relationships.join(',');
  }

  addFavoriteProduct(id: number) {
    return this.http.post(this.authService.api + '/properties/favorites', { property_id: id }, {
      headers: this.authService.authHeader
    }).toPromise();
  }

  removeFavoriteProduct(id: number) {
    return this.http.delete(this.authService.api + '/properties/favorites/' + id, {
      headers: this.authService.authHeader
    }).toPromise();
  }

  discardProduct(id: number) {
    return this.http.post(this.authService.api + '/properties/discarted', { property_id: id }, {
      headers: this.authService.authHeader
    }).toPromise();
  }

  removeDiscardProduct(id: number) {
    return this.http.delete(this.authService.api + '/properties/discarted/' + id, {
      headers: this.authService.authHeader
    }).toPromise();
  }

  removerAllDiscartedProducts() {
    return this.http.delete(this.authService.api + '/properties/discarted', {
      headers: this.authService.authHeader
    }).toPromise();
  }

  getDescartados(relationships?: Array<ProductRelationships>) {

    if (typeof relationships === 'undefined' || relationships === null) {
      relationships = [];
    }

    return new Promise<[]>((resolve) => {
      this.http.get(this.authService.api + '/properties/discarted', {
        headers: this.authService.authHeader,
        params: {
          include: this.getProductRelationships(relationships)
        }
      }).subscribe((response: { data: any }) => {
        resolve(response.data);
      }, e => {
        console.log(e);
      });
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      color: color,
      buttons: [
        {
          text: 'ok'
        }
      ],
      duration: 3000
    });
    toast.present();
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
            this.getProducts();
          }
        }
      ]
    });
    alert.present();
    return alert;
  }
}

