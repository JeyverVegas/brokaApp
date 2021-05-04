import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../servicios/authentication.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

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
    private toastCtrl: ToastController

  ) { }

  ngOnInit() {
  }

  async onSubmit() {
    this.playSound();
    this.usuario.password_confirmation = this.usuario.password;
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Cargando...',
      duration: 10000,
      cssClass: 'custom-loading custom-loading-primary',
    });

    loading.onDidDismiss().then(() => {
      if (!this.isRegistered && !this.error.displayError) {
        this.presentToast('Ha ocurrido un error al registrarse, por favor verifique su conexion a internet.', 'danger');
      }
    })

    loading.present();

    this.authService.register(this.usuario).subscribe(async (response) => {
      this.isRegistered = true;
      await loading.dismiss();
      this.router.navigateByUrl('/filtros', { replaceUrl: true });
    }, async (err) => {
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
