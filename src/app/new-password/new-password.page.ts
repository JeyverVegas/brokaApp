import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../servicios/authentication.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {

  email = null;
  error = null;
  constructor(
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
    private smartAudio: SmartAudioService
  ) { }

  ngOnInit() {
  }

  async onSubmit(){
    this.playSound();
    let loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Enviando información.'
    });
    await loading.present();
    this.authService.updatePassword(this.email).then(async response =>{
      await loading.dismiss();      
      let toast = await this.presentToast('Se ha enviado un correo electronico a: ' + this.email, 'primary', true, 'login');
      console.log(response);
    }).catch(async err =>{
      await loading.dismiss();
      this.error = err.error;
      this.presentToast(this.firstError, 'danger');
      console.log(err);
    })
  }

  public get errorList() {
    return Object.entries(this.error.errors)
      .reduce((acum, [_, value]) => acum.concat(value), []);
  }

  public get firstError() {
    return this.errorList[0];
  }

  async presentToast(mensaje:string, color:string, redireciona?:boolean, urlPath?:string){
    const toast = await this.toastCtrl.create({
      message: mensaje,
      color: color,
      duration: 3000,
      mode: 'ios',
      buttons: ['Ok']
    });

    toast.present();

    if(redireciona){
      toast.onDidDismiss().then(() =>{
        this.router.navigateByUrl(urlPath, {replaceUrl: true});
      });
    }
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }

}
