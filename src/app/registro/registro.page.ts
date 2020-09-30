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
    });

    loading.present();
    
    this.authService.register(this.usuario).subscribe( async (response) =>{
      await loading.dismiss();      
      this.router.navigateByUrl('/introduction', {replaceUrl: true});
    }, async (err) =>{

      await loading.dismiss();      

      this.presentToast('error al registrar el usuario', 'danger');
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
