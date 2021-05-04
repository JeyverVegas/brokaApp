import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, timeout } from 'rxjs/operators';
import { City, State } from '../interface';
import { AuthenticationService } from './authentication.service';
import { DEFAULT_REQUEST_TIMEOUT } from './productos.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  getStates(): Promise<State[]> {
    return new Promise((resolve, reject) => {
      this.http.get(this.authService.api + '/states', {
        headers: this.authService.authHeader
      }).pipe(
        timeout(DEFAULT_REQUEST_TIMEOUT),
        catchError(e => {
          throw new Error("Tiempo de espera excedido.");
        })
      ).subscribe((response: { data: State[] }) => {
        resolve(response.data);
      }, error => {
        reject(error);
      })
    });
  }

  getCityById(cityId?: number): Promise<City> {
    return new Promise((resolve, reject) => {
      let query = this.authService.api + '/cities';

      if (cityId) {
        query = query + '/' + cityId;
      }

      this.http.get(query, {
        headers: this.authService.authHeader
      }).subscribe((response: { data: City }) => {
        resolve(response.data);
      }, error => {
        reject(error);
      })
    });
  }

  getCities(statesID?: number[], searchFilter?: string): Promise<City[]> {
    return new Promise((resolve, reject) => {
      let query = this.authService.api + '/cities';

      if (searchFilter || statesID) {
        query = query + '?';
      }

      if (statesID) {
        query = query + 'filter[state]=' + statesID.join(',');
      }

      if (searchFilter) {
        query = query + 'filter[name]=' + searchFilter;
      }

      this.http.get(query, {
        headers: this.authService.authHeader
      }).subscribe((response: { data: City[] }) => {
        resolve(response.data);
      }, error => {
        reject(error);
      })
    });
  }


}
