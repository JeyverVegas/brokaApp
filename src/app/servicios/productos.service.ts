import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { ContractType, GetProductsOptions, ProductFilters, ProductRelationships, PropertyFeatures, PropertyType } from '../interface'
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private productos = new BehaviorSubject([]);

  filtros: ProductFilters = {};
  filtrado = false;
  loading = null;
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController
  ) { }

  getMaxAndMin(properties) {
    return {
      price: {
        min: Math.min.apply(Math, properties.map(function (o) { if (typeof o.price !== 'undefined' && o.price !== null) { return o.price; } else { return false } })),
        max: Math.max.apply(Math, properties.map(function (o) { if (typeof o.price !== 'undefined' && o.price !== null) { return o.price; } else { return false } })),
      },

      size: {
        min: Math.min.apply(Math, properties.map(function (o) { if (typeof o.square_meters !== 'undefined' && o.square_meters !== null) { return o.square_meters; } else { return false } })),
        max: Math.max.apply(Math, properties.map(function (o) { if (typeof o.square_meters !== 'undefined' && o.square_meters !== null) { return o.square_meters; } else { return false } })),
      },

      rooms: {
        min: Math.min.apply(Math, properties.map(function (o) { if (typeof o.rooms !== 'undefined' && o.rooms !== null) { return o.rooms; } else { return false } })),
        max: Math.max.apply(Math, properties.map(function (o) { if (typeof o.rooms !== 'undefined' && o.rooms !== null) { return o.rooms; } else { return false } })),
      },
      bathrooms: {
        min: Math.min.apply(Math, properties.map(function (o) { if (typeof o.bathrooms !== 'undefined' && o.bathrooms !== null) { return o.bathrooms; } else { return false } })),
        max: Math.max.apply(Math, properties.map(function (o) { if (typeof o.bathrooms !== 'undefined' && o.bathrooms !== null) { return o.bathrooms; } else { return false } })),
      }
    }
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

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Cargando productos...'
    });
    await this.loading.present();
  }

  uploadSearch(search){
    return this.http.post(this.authService.api + '/profile/search-parameters', search, {
      headers: this.authService.authHeader
    }).toPromise();
  }

  downloadSearch(){
    return this.http.get(this.authService.api + '/profile/search-parameters', {
      headers: this.authService.authHeader
    }).toPromise();
  }

  async getProducts(options?: GetProductsOptions) {

    if (typeof options === 'undefined' || options === null) {
      options = {
        relationships: [],
        filters: {}
      };
    }
    await this.presentLoading();
    if (this.filtrado) {
      this.productos.next(await this.findProducts({ relationships: options.relationships, filters: this.filtros }));
    } else {

      this.productos.next(await this.findProducts({ relationships: options.relationships }));
    }
    await this.loading.dismiss();
    return this.productos;
  }

  findProducts(options?: GetProductsOptions) {

    if (typeof options === 'undefined' || options === null) {
      options = {
        relationships: [],
        filters: {}
      };
    }

    const filters: ProductFilters = {
      name: '',
      type: [],
      contractType: [],
      status: [],
      hasAnyFeatures: [],
      realEstateAgency: [],
      sizeBetween: [0, 9999999999999],
      roomsBetween: [0, 999999999999],
      bathroomsBetween: [0, 999999999999],
      ...options.filters
    };

    return new Promise<[]>((resolve) => {
      this.http.get(this.authService.api + '/properties', {
        headers: this.authService.authHeader,
        params: {
          include: this.getProductRelationships(options.relationships),
          'filter[name]': filters.name,
          'filter[type]': filters.type?.join(','),
          'filter[contract_type]': filters.contractType?.join(','),
          'filter[size_between]': filters.sizeBetween ? filters.sizeBetween?.join(',') : '',
          'filter[rooms_between]': filters.roomsBetween ? filters.roomsBetween?.join(',') : '',
          'filter[bathrooms_between]': filters.bathroomsBetween ? filters.bathroomsBetween?.join(',') : '',
          'filter[status]': filters.status?.join(','),
          'filter[has_any_features]': filters.hasAnyFeatures?.join(','),
          'filter[real_estate_agency]': filters.realEstateAgency?.join(','),
        }
      }).subscribe((response: { data: [] }) => {
        resolve(response.data);
      }, async error => {
        await this.loading.dismiss();
        console.log(error);
        alert(JSON.stringify(error));
      })
    });
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
}

