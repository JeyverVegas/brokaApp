import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-mis-busquedas',
  templateUrl: './mis-busquedas.page.html',
  styleUrls: ['./mis-busquedas.page.scss'],
})
export class MisBusquedasPage implements OnInit {

  busquedas = [];

  constructor(
    private storage: Storage,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private smartAudio: SmartAudioService,
    private loadingCtrl: LoadingController,
    private productosService: ProductosService,
    private router: Router
  ) { }

  async ionViewDidEnter() {
    let busquedas = await this.storage.get('user-search');
    if (busquedas !== null) {
      this.busquedas = busquedas;
    }
    console.log(this.busquedas);
  }

  async ngOnInit() {

  }

  deleteAll() {
    this.storage.remove('user-search').then(() => {
      this.busquedas = [];
      this.presentToast('las busquedas han sido eliminadas.', 'primary');
    }).catch(err => {
      this.presentToast('ha ocurrido un error al eliminar las busquedas.', 'danger');
    })
  }

  async presentAlert() {
    this.playSound();
    const alerta = await this.alertCtrl.create({
      header: '¿Estas seguro?',
      message: '¿Quieres eliminar todas las busquedas registradas en el telefono?',
      mode: 'ios',
      buttons: [
        {
          text: 'no'
        },
        {
          text: 'si',
          cssClass: 'color_danger',
          handler: () => {
            this.deleteAll();
          }
        }
      ]
    });

    alerta.present();
  }

  async delete(busqueda) {
    this.playSound();
    const alerta = await this.alertCtrl.create({
      header: '¿Quieres eliminar?',
      message: busqueda.nameSearch,
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.playSound();
          }
        },
        {
          text: 'Si',
          handler: async () => {
            this.playSound();
            const loading = await this.loadingCtrl.create({
              spinner: 'dots',
              message: 'Cargando...'
            });
            loading.present();
            for (let [index, b] of this.busquedas.entries()) {
              if (b.id === busqueda.id) {
                this.busquedas.splice(index, 1);
                let valor = this.busquedas;
                if (this.busquedas.length == 0) {
                  valor = null;
                }
                this.storage.set('user-search', valor).then(() => {
                  loading.dismiss().then(() => {
                    this.presentToast('la busqueda: ' + busqueda.nameSearch + '. ha sido eliminada', 'secondary');
                  });
                }).catch(err => {
                  alert('ha ocurrido un error al eliminar la busqueda.');
                })
              }
            }
          }
        }
      ]
    });
    await alerta.present();
  }

  async apply(busqueda) {
    this.playSound();
    const alerta = await this.alertCtrl.create({
      header: '¿realizar esta busqueda: ' + busqueda.nameSearch,
      message: '¿desea aplicar en los filtros esta busqueda?',
      buttons: [
        {
          text: 'no',
          handler: () => {
            this.playSound();
          }
        },
        {
          text: 'si',
          handler: () => {
            this.playSound();
            this.productosService.filtros = busqueda;
            this.productosService.filtrado = true;
            this.presentToast('Se ha establecido la busqueda: ' + busqueda.nameSearch, 'secondary');
          }
        }
      ]
    });
    alerta.present();
  }

  async uploadSearch() {
    const loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Cargando...',
    });
    loading.present();
    this.productosService.uploadSearch({ data: this.busquedas }).then((response: any) => {
      loading.dismiss();
      this.presentToast(response.message, 'tertiary');
      console.log(response)
    }).catch(err => {
      loading.dismiss();
      this.presentToast(err.error.message, 'tertiary');
      console.log(err)
    })
  }

  async downloadSearch() {
    const alerta = await this.alertCtrl.create({
      header: '¿Estas de acuerdo?',
      message: 'Al descargar tus busquedas en la nube las que estan en el telefono seran eliminadas y reemplazadas por las que se encuentran en la nube.',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.playSound();
          }
        },
        {
          text: 'Si',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              spinner: 'dots',
              message: 'Cargando...',
            });
            loading.present();
            this.productosService.downloadSearch().then((response: any) => {
              loading.dismiss();
              this.busquedas = response;
              this.storage.set('user-search', this.busquedas).then(()=>{
                this.presentToast('Las busquedas han sido descargadas exitosamente', 'primary');
              });
              console.log(response);
            }).catch(err => {
              loading.dismiss();
              this.presentToast(err.error.message, 'danger');
              console.log(err)
            })
          }
        }
      ]
    });
    alerta.present();
  }


  async presentToast(mensaje: string, color: string, redireciona?: boolean, urlPath?: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 3000,
      mode: 'ios',
      buttons: ['Ok']
    });

    toast.present();

    if (redireciona) {
      toast.onDidDismiss().then(() => {
        this.router.navigateByUrl(urlPath, { replaceUrl: true });
      });
    }
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

}
