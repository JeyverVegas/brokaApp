import { Component } from '@angular/core';

import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SmartAudioService } from './servicios/smart-audio.service';
import { AuthenticationService } from './servicios/authentication.service';
import { Router, RouterEvent } from '@angular/router';
import { Usuario } from './interface';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  user = {
    profile: { firstname: 'Invitado', image: '' }
  } as Usuario;

  selectedPath = null;

  pages = [
    {
      name: 'Abrir Mapa',
      icon: 'location-outline',
      active: true,
      url: '/map'
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
      url: '/tabs/tabs/mis-busquedas'
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
    private loadingCtrl: LoadingController,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
  ) {
    this.initializeApp();
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = this.router.url;
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.smartAudio.preload('tabSwitch', 'assets/audios/click.mp3');
      this.smartAudio.preload('chatsound', 'assets/audios/chatsound.mp3');
      if (this.platform.is('cordova')) {
        this.setupPush();
      }
    });
  }

  setupPush() {
    
    this.oneSignal.startInit('eb9f921d-63b7-4c42-9dec-82544a36a935', '277124092318');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    this.oneSignal.handleNotificationReceived().subscribe((data) => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });    

    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      let additionalData = data.notification.payload.additionalData;
      this.showAlert('Notificación Abierta', 'Ya has abierto esto antes', additionalData.task);
    });

    this.oneSignal.endInit();
  }

  async showAlert(title, msg , task){
    const alerta = await this.alertCtrl.create({
      header: title,
      message: msg,
      buttons: [
        {
          text: 'Action: ' + task,
          handler: () =>{
            alert('has algo.');
          }
        }
      ]
    });
    alerta.present();
  }

  updateUser() {
    this.user = this.authService.user;
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

  async logOut() {
    this.playSound();
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Cerrando Sesión.',
    });

    await loading.present();

    await this.authService.logOut().then(() => {
      loading.dismiss().then(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      });
    });
  }
}
