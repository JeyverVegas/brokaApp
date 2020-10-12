import { Component } from '@angular/core';

import { LoadingController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SmartAudioService } from './servicios/smart-audio.service';
import { AuthenticationService } from './servicios/authentication.service';
import { Router, RouterEvent } from '@angular/router';
import { Usuario } from './interface';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent{

  user = {
    profile: {firstname: 'Invitado', image: ''}
  } as Usuario;

  selectedPath = null;

  pages = [
    {
      name: 'Nueva búsqueda',
      icon: 'search-outline',
      active: true,
      url: ''
    },
    {
      name: 'Mis notificaciones',
      icon: 'notifications',
      active: false,
      url: ''
    },
    {
      name: 'Mis búsquedas',
      icon: 'search-circle-outline',
      active: false,
      url: ''
    },
    {
      name: 'Mis favoritos',
      icon: 'heart-outline',
      active: false,
      url: '/tabs/tabs/favoritos'
    },
    {
      name: 'Mis descartados',
      icon: 'trash-outline',
      active: false,
      url: '/tabs/tabs/descartado'
    },
    {
      name: 'Mis Inmobiliarias',
      icon: 'home-outline',
      active: false,
      url: '/tabs/tabs/inmobiliarias'
    },
    {
      name: 'Contacte con nosotros',
      icon: 'call-outline',
      active: false,
      url: ''
    },
  ]


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private smartAudio: SmartAudioService,
    private authService: AuthenticationService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {
    this.initializeApp();
    this.router.events.subscribe((event: RouterEvent) =>{
      this.selectedPath = this.router.url;      
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.smartAudio.preload('tabSwitch', 'assets/audios/click.mp3');
    });
  }

  updateUser(){
    if(this.authService.user.profile !== null){
      this.user.profile = this.authService.user.profile
    }
    this.user.email = this.authService.user.email;
  }
  
  playSound(){
    this.smartAudio.play('tabSwitch');    
  }

  async logOut() {    
    this.playSound();
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'cerrando sesion',
      duration: 3000
    });

    await loading.present();

    await this.authService.logOut().then(() =>{
      loading.onWillDismiss().then(() => {
        this.router. navigateByUrl('/login', {replaceUrl: true});
      });
    });    
  }
}
