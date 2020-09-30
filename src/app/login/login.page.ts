import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Button } from 'protractor';
import { AuthenticationService } from '../servicios/authentication.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

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

  async ngOnInit() {
   let token = await this.authService.getCsrfToken();
   alert(JSON.stringify(token));
  }  

  async onSubmit() {    
    this.playSound();
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Cargando...',      
    });

    loading.present();
    
    this.authService.login(this.usuario).subscribe( async (response) =>{
      await loading.dismiss();      
      this.router.navigateByUrl('tabs', {replaceUrl: true});
    }, async (err) =>{

      await loading.dismiss();      
      alert(JSON.stringify(err));
      this.presentToast('error al iniciar sesión.', 'danger');
      this.error.message = err.error.message;
      this.error.errors = err.error.errors;
      this.error.displayError = true;      
    })
  }  

  async presentToast(mensaje, color){
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: color,
      duration: 3000,
      buttons: ['Ok']
    });

    toast.present();
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }

}
