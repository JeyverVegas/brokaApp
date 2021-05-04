import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../servicios/authentication.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { catchError, timeout } from 'rxjs/operators';
import { DEFAULT_REQUEST_TIMEOUT } from '../servicios/productos.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario = {
    email: "",
    password: "",
    device_name: "hola"
  }

  userData = {};

  error = {
    message: '',
    errors: {},
    displayError: false
  }

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private smartAudio: SmartAudioService,
    private authService: AuthenticationService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {

  }

  async onSubmit() {
    this.playSound();
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Cargando...',
      cssClass: 'custom-loading custom-loading-primary',
    });

    loading.present();

    this.authService.login(this.usuario).pipe(
      timeout(DEFAULT_REQUEST_TIMEOUT),
      catchError(e => {
        throw new Error("Tiempo de espera excedido.");
      })
    ).subscribe(async (response) => {
      await loading.dismiss();
      this.router.navigateByUrl('filtros', { replaceUrl: true });
    }, async (err) => {
      await loading.dismiss();

      if (err.message == "Tiempo de espera excedido.") {
        this.alertCtrl.create({
          header: 'Error de conexión',
          message: err,
          buttons: [
            {
              text: 'Ok'
            }
          ]
        }).then(a => {
          a.present();
        });

        return;
      }

      this.error.message = err.error.message;
      this.error.errors = err.error.errors;
      this.error.displayError = true;
      this.presentToast(this.firstError, 'danger');
    })
  }

  async presentToast(mensaje, color) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: color,
      duration: 3000,
      buttons: ['Ok']
    });

    toast.present();
  }

  public get errorList() {
    return Object.entries(this.error.errors)
      .reduce((acum, [_, value]) => acum.concat(value), []);
  }

  public get firstError() {
    return this.errorList[0];
  }

  logFacebook() {
    this.playSound();
    this.authService.loginFacebook();
  }

  logGoogle() {
    this.playSound();
    this.authService.loginGoogle();
  }

  goToRegister() {
    this.router.navigateByUrl('registro', { replaceUrl: true });
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

}
