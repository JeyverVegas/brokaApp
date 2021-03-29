import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { PropertyCardPage } from '../property-card/property-card.page';
import { AuthenticationService } from '../servicios/authentication.service';
import { ChatService } from '../servicios/chat.service';
import { MatchService } from '../servicios/match.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {

  showmatch: boolean = false;
  showdelete: boolean = false;
  productos = new BehaviorSubject([]);
  filtro = [];
  refrescando: any = null;
  next = null;
  constructor(
    private productosService: ProductosService,
    private authService: AuthenticationService,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private toastController: ToastController,
    private http: HttpClient,
    private router: Router,
    private alertCtrl: AlertController,
    private matchService: MatchService,
    private chatService: ChatService
  ) { }

  async ngOnInit() {

  }

  async ionViewDidEnter() {
    this.productos = await this.productosService.getProducts();
    this.initializedItems();
  }

  initializedItems() {
    this.productos.subscribe(productos => {
      this.filtro = productos;
      this.next = this.productosService.getNext();
      if (this.refrescando) {
        this.refrescando.complete();
      }
    });
  }

  async openProduct(producto) {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: PropertyCardPage,
      componentProps: {
        property: producto
      }
    });
    modal.present();
  }

  filtrar(ev) {
    this.filtro = this.productos.getValue();

    const valor = ev.target.value;

    if (!valor) {
      return
    }

    this.filtro = this.filtro.filter(producto => {
      if (producto.address.address && valor) {
        return (producto.address.address.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      }
    });
  }

  addToFavorite(producto) {
    this.playSound();
    this.productosService.addFavoriteProduct(producto.id).then(response => {
      this.presentToast(producto.name + ' ha sido añadido a favoritos.', 'success');
      producto.is_favorite = true;
      producto.favorite_to_count++;
    }).catch(error => {
      this.presentToast(error.error.errors.property_id[0], 'danger');
    });
  }

  removeFromFavorite(producto) {
    this.playSound();
    this.productosService.removeFavoriteProduct(producto.id).then(response => {
      this.presentToast(producto.name + ' ha sido removido de favoritos', 'success');
      producto.is_favorite = false;
      producto.favorite_to_count--;
    }).catch(error => {
      this.presentToast('Ha ocurrido un error al quitar el producto de favoritos.', 'danger');
      console.log(error);
    });
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

  async openPreview(img) {
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      cssClass: 'b_transparent',
      componentProps: {
        img: img
      }
    });

    modal.present();
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
    this.refrescando = event.target;
    this.productosService.getProducts();
  }

  loadMore(event) {
    if (this.next) {
      event.target.disabled = false;
      this.http.get(this.next, {
        headers: this.authService.authHeader
      }).toPromise().then((response: any) => {
        this.productos.next(this.productos.value.concat(response.data));
        if (response.links.next) {
          this.next = response.links.next;
        } else {
          this.next = null;
        }
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        event.target.complete();
      })
    } else {
      event.target.complete();
    }
  }

  async matchear(product) {
    this.playSound();

    if (this.authService.user.profile && this.authService.user.address) {
      this.playSound();
      this.showmatch = true;
      this.matchService.storeMatch({ property_id: product.id }).then(response => {
        this.chatService.getChats();
        for (let [index, p] of this.productos.getValue().entries()) {
          if (p.id === product.id) {

            this.productos.getValue().splice(index, 1);
          }
        }
        if (this.productos.value.length == 0) {
          this.productosService.getProducts();
        }
      }).catch(err => {
        console.log(err);
        this.presentToast('Ha ocurrido un error al matchear la propiedad.', 'danger');
      }).finally(async () => {
        this.showmatch = false;
      });
    } else {
      this.alertCtrl.create({
        header: 'Debe completar primero su perfil',
        message: 'Para poder matchear una propiedad primero debe completar su perfil ;).',
        buttons: [
          {
            text: 'SEGUIR MIRANDO',
            handler: () => {
              this.playSound();
            }
          },
          {
            text: 'COMPLETAR PERFIL',
            handler: async () => {
              this.playSound();
              this.router.navigateByUrl('/user-profile');
            }
          }
        ]
      }).then(a => a.present());
    }
  }

  async descartar(product) {
    this.playSound();
    this.showdelete = true;
    this.productosService.discardProduct(product.id).then(response => {
      for (let [index, p] of this.productos.getValue().entries()) {
        if (p.id === product.id) {

          this.productos.getValue().splice(index, 1);
        }
      }
      if (this.productos.value.length == 0) {
        this.productosService.getProducts();
      }
    }).catch(error => {
      console.log(error);
      this.presentToast(error.error.errors.property_id[0], 'danger');
    }).finally(() => {
      this.showdelete = false;
    });
  }


  findPrice(prices: any[]) {
    var price = null;

    if (this.productosService.filtros.currency) {
      price = prices.find(price => price.currency.id == this.productosService.filtros.currency);
    } else {
      price = prices[0];
    }

    if (price) {
      price.price_value = parseInt(price.price_value, 0);
    }

    return price;
  }


}
