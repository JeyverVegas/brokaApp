import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City, State } from '../interface';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  
  

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  getStates(): Promise<State[]>{
    return new Promise((resolve) =>{
      this.http.get(this.authService.api + '/states', {
        headers: this.authService.authHeader
      }).subscribe((response: {data:State[]}) =>{        
        resolve(response.data);
      }, error => {
        alert(JSON.stringify(error));
      })
    });
  }

  getCities(): Promise<City[]>{
    return new Promise((resolve) =>{
      this.http.get(this.authService.api + '/cities', {
        headers: this.authService.authHeader
      }).subscribe((response: {data:City[]}) =>{        
        resolve(response.data);
      }, error => {
        alert(JSON.stringify(error));
      })
    });
  }

  
}
