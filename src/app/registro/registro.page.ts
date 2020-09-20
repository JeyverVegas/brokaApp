import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  usuario = {
    email: "",
    password: "",
    user: "",
    terms: false
  }

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController
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
