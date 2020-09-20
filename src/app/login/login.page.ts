import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario = {
    email: "",
    password: ""
  }

  constructor(
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Cargando...',
      duration: 3000
    }).then(l => {
      l.present();
      l.onWillDismiss().then(() => {
        this.navCtrl.navigateForward('tabs');
      })
    });
  }

}
