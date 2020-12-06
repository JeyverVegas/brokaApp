import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { ContractType, ProductFilters, ProductRelationships, PropertyFeatures, PropertyType } from '../interface'
import { LoadingController, ToastController } from '@ionic/angular';

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
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
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

  getProducts() {
    this.findProducts();
    return this.productos;
  }

  getOneProduct(propertyID: number){
    return this.http.get(this.authService.api + '/properties/' + propertyID, {
      headers: this.authService.authHeader,
      params: {
        include: this.getProductRelationships([])
      }
    }).toPromise();
  }

  async findProducts(relationships?) {

    this.loading = await this.loadingCtrl.create({
      message: 'Cargando productos...',
      spinner: 'bubbles'
    });

    this.loading.present();

    if (!relationships) {
      relationships = [];
    }

    this.http.get(this.authService.api + '/properties' + this.getFilters(), {
      headers: this.authService.authHeader,
      params: {
        include: this.getProductRelationships(relationships)
      }
    }).subscribe((response: { data: [], meta: any, links: any }) => {
      this.productos.next(response.data);
      this.total.next(response.meta.total);
      this.next = response.links.next;      
      this.loading.dismiss();
    }, async error => {
      await this.loading.dismiss();
      this.presentToast('Ha ocurrido un error', 'danger');
      console.log(error);
    })
  }

  getTotal() {
    return this.total;
  }
  
  getNext(){
    return this.next;
  }

  getFilters() {
    var queryString = '?';
    try {
      if (this.filtros.type) {
        queryString = queryString + 'filter[type]=' + this.filtros.type.join(',') + '&';
      }

      if (this.filtros.contractType) {
        queryString = queryString + 'filter[contract_type]=' + this.filtros.contractType.join(',') + '&';
      }

      if (this.filtros.sizeBetween) {
        queryString = queryString + 'filter[size_between]=' + this.filtros.sizeBetween.join(',') + '&';
      }

      if (this.filtros.roomsBetween) {
        queryString = queryString + 'filter[rooms_between]=' + this.filtros.roomsBetween.join(',') + '&';
      }

      if (this.filtros.bathroomsBetween) {
        queryString = queryString + 'filter[bathrooms_between]=' + this.filtros.bathroomsBetween.join(',') + '&';
      }

      if (this.filtros.environmentsBetween) {
        queryString = queryString + 'filter[environments_between]=' + this.filtros.environmentsBetween.join(',') + '&';
      }

      if (this.filtros.status) {
        queryString = queryString + 'filter[status]=' + this.filtros.status.join(',') + '&';
      }

      if (this.filtros.hasAnyFeatures) {
        queryString = queryString + 'filter[has_any_features]=' + this.filtros.hasAnyFeatures.join(',') + '&';
      }

      if (this.filtros.realEstateAgency) {
        queryString = queryString + 'filter[real_estate_agency]=' + this.filtros.realEstateAgency.join(',') + '&';
      }

      if (this.filtros.radius) {
        queryString = queryString + 'filter[radius]=' + this.filtros.radius.join(',') + '&';
      }

      if (this.filtros.state && this.filtros.state != 0) {
        queryString = queryString + 'filter[state]=' + this.filtros.state + '&';
        if (this.filtros.city && this.filtros.city != 0) {
          queryString = queryString + 'filter[city]=' + this.filtros.city + '&';
        }
      }

      if (this.filtros.currency && this.filtros.priceBetween) {
        queryString = queryString + 'filter[price_between]=' + this.filtros.currency + ',' + this.filtros.priceBetween.join(',') + '&';
      }

      queryString = queryString.slice(0, -1);

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

    relationships.push(...aditionalRels);

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

  removerAllDiscartedProducts(){
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
}

