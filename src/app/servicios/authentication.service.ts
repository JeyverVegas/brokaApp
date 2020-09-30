import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Profile, Usuario } from '../interface';

const TOKEN_KEY = 'my-token';
const USER_DATA = 'user-data';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(null);
  token = '';
  host = 'localhost';
  user: BehaviorSubject<Usuario> = new BehaviorSubject(null);

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
      this.user.next(user);
      console.log(this.user.getValue());
      this.isAuthenticated.next(true)
    } else {
      this.isAuthenticated.next(false);
    }

  }

  getCsrfToken() {
    return new Promise(resolve =>{
      this.http.get('http://' + this.host + '/inmobiliaria/sanctum/csrf-cookie').subscribe(csrfToken => {
        resolve(csrfToken);
      }, error =>{        
        alert(JSON.stringify(error));
      });
    })
  }

  login(credentials): Observable<any> {
    
    /* let header = new HttpHeaders();
    header = header.set('XSRF-TOKEN', this.getCsrfToken()); */

    return this.http.post('http://' + this.host + '/inmobiliaria/public/api/login', credentials).pipe(
      map((response: { data: Usuario; token: string }) => {
        this.user.next(response.data);
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

  updateProfile(formData) {

    let header = new HttpHeaders();
    header = header.set('Authorization', 'Bearer ' + this.token).set('Accept', 'application/json');

    return this.http.post('http://' + this.host + '/inmobiliaria/public/api/profile', formData, {
      headers: header
    }).pipe(
      map((response: { data: Profile }) => {
        let user = this.user.getValue();
        Object.assign(user.profile, response.data);
        this.user.next(user);
        return user;
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
    return this.http.post('http://' + this.host + '/inmobiliaria/public/api/register', credentials).pipe(
      map((response: { data: Usuario; token: string }) => {
        this.user.next(response.data);
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
    return this.storage.remove(TOKEN_KEY) && this.storage.remove(USER_DATA);;
  }


}
