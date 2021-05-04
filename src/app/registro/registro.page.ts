import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { catchError, timeout } from 'rxjs/operators';
import { AuthenticationService } from '../servicios/authentication.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { DEFAULT_REQUEST_TIMEOUT } from '../servicios/productos.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  usuario = {
    email: "",
    password: "",
    terms: false,
    device_name: "hola",
    password_confirmation: ""
  }

  isRegistered: boolean = false;

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

  ngOnInit() {
  }

  async onSubmit() {
    this.playSound();
    this.usuario.password_confirmation = this.usuario.password;
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Cargando...',
      cssClass: 'custom-loading custom-loading-primary',
    });

    loading.present();

    this.authService.register(this.usuario).pipe(
      timeout(DEFAULT_REQUEST_TIMEOUT),
      catchError(e => {
        throw new Error("Tiempo de espera excedido.");
      })
    ).subscribe(async (response) => {
      this.isRegistered = true;
      await loading.dismiss();
      this.router.navigateByUrl('/filtros', { replaceUrl: true });
    }, async (err) => {

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

      this.presentToast('error al registrar el usuario', 'danger');
      this.error.message = err.error.message;
      this.error.errors = err.error.errors;
      this.error.displayError = true;
      await loading.dismiss();
    });
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

  goToLogin() {
    this.router.navigateByUrl('login', { replaceUrl: true });
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

}
