import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { PropertyCardPage } from '../property-card/property-card.page';
import { AuthenticationService } from '../servicios/authentication.service';
import { NotificacionesService } from '../servicios/notificaciones.service';
import { ProductosService } from '../servicios/productos.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  notificaciones = [];
  next = null;
  constructor(
    private notificacionesService: NotificacionesService,
    private authService: AuthenticationService,
    private productosService: ProductosService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { }

  async ngOnInit() {
  }

  async ionViewDidEnter() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Cargando...'
    });
    await loading.present();
    this.notificacionesService.getNotifications().then((response: any) => {
      this.notificaciones = response.data;
      this.next = response.links.next;
      console.log(response);
    }).catch(err => {
      console.log(err);
    }).finally(async () => {
      await loading.dismiss();
    })
  }

  loadMore(event) {
    if (this.next) {
      this.http.get(this.next, {
        headers: this.authService.authHeader
      }).toPromise().then((response: any) => {
        console.log(response);
        this.notificaciones = [...this.notificaciones, ...response.data];
        this.next = response.next;
      }).catch(err => {

        console.log(err)

      }).finally(() => {
        event.target.complete();
      })
    } else {
      event.target.disabled = true;
    }
  }

  iconForNotificationType(type: string) {
    if (type == 'match_accepted') {
      return { icon: 'happy-outline', color: 'success' }
    }
    if (type == 'unknown') {
      return { icon: 'close', color: 'danger' }
    }

    if (type == 'property_created') {
      return { icon: 'home', color: 'medium' }
    }
  }

  async doSomething(notification: any) {
    console.log(notification);
    this.notificacionesService.notificationMarkRead(notification.id).then(async (response: any) => {
      notification = response.data;
      notification.read_at = response.data.read_at;
      console.log(response.data)
      if (notification.additional_data.computed_type == 'match_accepted') {
        this.router.navigateByUrl('/tabs/tabs/mis-matchs');
      }
      if (notification.additional_data.computed_type == 'unknown') {
        this.router.navigateByUrl('/tabs/tabs/mis-matchs');
      }

      if (notification.additional_data.computed_type == 'property_created') {
        const loading = await this.loadingCtrl.create({
          spinner: 'lines',
          message: 'Cargando...'
        });
        await loading.present();
        this.productosService.getOneProduct(notification.additional_data.property_id).then(async (response: any) => {
          const modal = await this.modalCtrl.create({
            component: PropertyCardPage,
            componentProps: {
              producto: response.data
            }
          });
          await modal.present();
        }).catch(err => {
          console.log(err);
          this.presentToast('Ha ocurrido un error al cargar la informacion :(', 'danger');
        }).finally(async () => {
          await loading.dismiss();
        })
      }
      this.ref.detectChanges();
    }).catch(err => {
      console.log(err);
    })
  }


  async presentToast(text, color) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000,
      color: color,
      mode: 'ios'
    });
    toast.present();
  }

  async doRefresh(event) {
    this.notificacionesService.getNotifications().then((response: any) => {
      this.notificaciones = response.data;
      this.next = response.links.next;
      console.log(response);
    }).catch(err => {
      console.log(err);
    }).finally(async () => {
      event.target.complete();
    })
  }


}
