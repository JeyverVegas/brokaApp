import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Profile, UserAddress, Usuario } from '../interface';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import { DEFAULT_REQUEST_TIMEOUT } from './productos.service';


const TOKEN_KEY = 'my-token';
const USER_DATA = 'user-data';
const USER_SEARCH = 'user-search';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(null);
  token = '';
  /* 3.92.133.52 */
  host = '18.219.211.63';
  api = 'http://' + this.host + '/api'
  user: Usuario = null;
  authHeader = null;

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private facebook: Facebook,
    private googlePlus: GooglePlus,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router,
  ) {

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

  loginFacebook() {
    this.facebook.login(['email', 'public_profile']).then((resp: FacebookLoginResponse) => {
      this.facebook.api('me?fields=picture.width(720).height(720).as(picture_large)', []).then(async profile => {
        let loading = await this.loadingCtrl.create({
          spinner: 'dots',
          message: 'Iniciando Sesion.',
        });
        await loading.present();
        this.http.post(this.api + '/login/facebook', { access_token: resp.authResponse.accessToken }).toPromise().then(async (response: any) => {
          this.user = response.data;
          this.user.profile.image = profile['picture_large']['data']['url'];
          this.token = response.token;
          this.authHeader = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
          await this.storage.set(USER_DATA, this.user);
          await this.storage.set(TOKEN_KEY, response.token);
          this.isAuthenticated.next(true);
          this.router.navigateByUrl('filtros', { replaceUrl: true });
          loading.dismiss();
        }).catch(async error => {
          //ERROR AL INICIAR SESION EN EL SERVIDOR.
          await loading.dismiss();
          alert(JSON.stringify(error));
          this.presentToast('error al iniciar sesion.', 'danger');
        })
      }).catch(async error => {
        //ERROR AL OBTENER EL PERFIL DE FACEBOOK.        
        this.presentToast(error.errorMessage, 'danger');
        alert(JSON.stringify(error));
      });
    }).catch(async (err: any) => {
      //ERROR AL INICIARSESION EN FACEBOOK.      
      this.presentToast(err.errorMessage, 'danger');
      alert(JSON.stringify(err));
    })
  }

  loginGoogle() {
    this.googlePlus.login({}).then(async profile => {
      let loading = await this.loadingCtrl.create({
        spinner: 'dots',
        message: 'Iniciando Sesion.',
      });
      await loading.present();
      this.http.post(this.api + '/login/google', { access_token: profile.accessToken }).toPromise().then(async (response: any) => {
        this.user = response.data;
        this.user.profile.image = profile['imageUrl'];
        this.token = response.token;
        this.authHeader = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
        await this.storage.set(USER_DATA, this.user);
        await this.storage.set(TOKEN_KEY, response.token);
        this.isAuthenticated.next(true);
        await loading.dismiss();
        this.router.navigateByUrl('filtros', { replaceUrl: true });
      }).catch(async err => {
        await loading.dismiss();
        alert(JSON.stringify(err));
      })
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }

  updatePassword(email) {
    return this.http.post(this.api + "/forgot-password", { email: email }).toPromise();
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

      })
    )
  }

  updateProfileImage(formdata, profile_id) {
    let header = this.authHeader.set('Accept', 'application/json');
    return this.http.post(this.api + '/profile/' + profile_id + '/image', formdata, {
      headers: header
    }).toPromise();
  }

  updateGalleryImages(formdata) {
    let header = this.authHeader.set('Accept', 'application/json');
    return this.http.post(this.api + '/profile/images', formdata, {
      headers: header
    }).toPromise();
  }

  deleteImgGallery(imageId: number) {
    return this.http.delete(this.api + '/profile/images/' + imageId, {
      headers: this.authHeader
    }).toPromise();
  }



  addAddress(address: UserAddress) {

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

  updateAddress(address: UserAddress) {

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
    this.user = null;
    this.isAuthenticated.next(false);
    this.storage.remove(USER_DATA);
    this.facebook.logout();
    this.googlePlus.logout();
    return this.storage.remove(TOKEN_KEY);

  }

  async saveSearch(name: string, filtros) {

    filtros.nameSearch = name;
    filtros.createdAt = new Date().getTime();
    let userSearch: Array<any> = await this.storage.get(USER_SEARCH);
    console.log(userSearch);
    if (userSearch == null) {
      filtros.id = 1;
      userSearch = [];
      userSearch.push(filtros);
      this.storage.set(USER_SEARCH, userSearch);
    } else {
      let lastId = Math.max.apply(Math, userSearch.map(function (o) { if (typeof o.id !== 'undefined' && o.id !== null) { return o.id; } else { return false } }));
      let newLastId = lastId + 1;
      filtros.id = newLastId;
      userSearch.push(filtros);
      this.storage.set(USER_SEARCH, userSearch);
    }

  }

  async presentToast(text: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: text,
      color: color,
      duration: 3000,
      buttons: ['ok']
    });

    toast.present();
  }


}
