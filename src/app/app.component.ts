import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  usuario = {
    nombre: 'Jane',
    direccion: 'RECOLECTA C.A.B.A',
    descripcion: 'Necesito apartamento, preferiblemente cerca del alto palermo para facilidad en mi empleo.',
    perfilImg: '../../assets/images/user.PNG',
    images: [
      '../../assets/images/user(2).PNG',
      '../../assets/images/user(3).PNG',
      '../../assets/images/user(4).PNG',
      '../../assets/images/user(5).PNG',
      '../../assets/images/user(6).PNG'
    ]
  }


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
