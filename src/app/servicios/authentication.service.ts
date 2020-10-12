import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Profile, UserAddress, Usuario } from '../interface';

const TOKEN_KEY = 'my-token';
const USER_DATA = 'user-data';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(null);
  token = '';

  host = '192.168.0.100';
  api = 'http://' + this.host + '/inmobiliaria/public/api'
  user: Usuario = null;
  authHeader = null;

  constructor(private storage: Storage, private http: HttpClient, private platform: Platform) {
    if (platform.is('cordova')) {
      this.host = '192.168.0.100';
    }

    this.loadToken();
  }

  async loadToken() {
    const token = await this.storage.get(TOKEN_KEY);
    const user = await this.storage.get(USER_DATA);
    if (token && user) {
      this.token = token;
      this.user = user;
      this.authHeader = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);  
      this.isAuthenticated.next(true)
    } else {
      this.isAuthenticated.next(false);
    }

  }

  login(credentials): Observable<any> {

    return this.http.post(this.api + '/login', credentials).pipe(
      map((response: { data: Usuario; token: string }) => {
        this.user = response.data;
        this.token = response.token;
        this.authHeader = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
        this.storage.set(USER_DATA, response.data);        
        return response.token
      }),
      switchMap(token => {
        return from(this.storage.set(TOKEN_KEY, token));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  addProfile(formData) {

    let header = this.authHeader.set('Accept', 'application/json');

    return this.http.post(this.api + '/profile', formData, {
      headers: header
    }).pipe(
      map((response: { data: Profile }) => {
        this.user.profile = response.data;        
        return this.user;
      }),
      switchMap(user => {
        return from(this.storage.set(USER_DATA, user));
      }),
      tap(_ => {
        //this.isAuthenticated.next(true);
      })
    )
  }

  updateProfile(formData) {

    let header = this.authHeader.set('Accept', 'application/json');

    return this.http.post(this.api + '/profile/' + this.user.profile.id, formData, {
      headers: header
    }).pipe(
      map((response: { data: Profile }) => {
        this.user.profile = response.data;        
        return this.user;
      }),
      switchMap(user => {
        return from(this.storage.set(USER_DATA, user));
      }),
      tap(_ => {
        //this.isAuthenticated.next(true);
      })
    )
  }

  addAddress(address:UserAddress) {    

    return this.http.post(this.api + '/profile/address', address, {
      headers: this.authHeader
    }).pipe(
      map((response: { data: UserAddress }) => {
        this.user.address = response.data;      
        return this.user; 
      }),
      switchMap(user => {
        return from(this.storage.set(USER_DATA, user));
      }),
      tap(_ => {
        //this.isAuthenticated.next(true);
      })
    )
  }

  updateAddress(address:UserAddress) {    

    return this.http.put(this.api + '/profile/address/' + this.user.address.id, address, {
      headers: this.authHeader
    }).pipe(
      map((response: { data: UserAddress }) => {
        this.user.address = response.data;      
        return this.user; 
      }),
      switchMap(user => {
        return from(this.storage.set(USER_DATA, user));
      }),
      tap(_ => {
        //this.isAuthenticated.next(true);
      })
    )
  }

  register(credentials): Observable<any> {
    return this.http.post(this.api + '/register', credentials).pipe(
      map((response: { data: Usuario; token: string }) => {
        this.user = response.data;
        this.token = response.token;        
        this.authHeader = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
        this.storage.set(USER_DATA, response.data);
        return response.token
      }),
      switchMap(token => {
        return from(this.storage.set(TOKEN_KEY, token));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  logOut(): Promise<void> {
    this.isAuthenticated.next(false);
    this.storage.remove(USER_DATA)
    return this.storage.remove(TOKEN_KEY);
  }


}
