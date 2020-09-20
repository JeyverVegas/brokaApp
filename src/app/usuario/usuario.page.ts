import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  usuario = {
    nombre: 'Jane',
    direccion: 'RECOLECTA C.A.B.A',
    descripcion: 'Necesito apartamento, preferiblemente cerca del alto palermo para facilidad en mi empleo.',
    images: [
      '../../assets/images/user(2).PNG',
      '../../assets/images/user(3).PNG',
      '../../assets/images/user(4).PNG',
      '../../assets/images/user(5).PNG',
      '../../assets/images/user(6).PNG'
    ]
  }

  constructor(
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  async logOut(){
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'cerrando sesion',
      duration: 3000
    });

    loading.present();

    loading.onWillDismiss().then(()=>{
      this.navCtrl.navigateRoot('login');
    })
  }

}
