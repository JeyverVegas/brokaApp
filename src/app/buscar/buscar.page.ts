import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { AuthenticationService } from '../servicios/authentication.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ShowProductPage } from '../show-product/show-product.page';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {

  productos = new BehaviorSubject([]);
  filtro = [];
  refrescando: any = null;


  constructor(
    private productosService: ProductosService,
    private authService: AuthenticationService,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private toastController: ToastController,
    private http: HttpClient,

  ) { }

  async ngOnInit() {

  }

  async ionViewDidEnter() {
    this.productos = this.productosService.getProducts();
    this.initializedItems();    
  }

  initializedItems() {
    this.productos.subscribe(productos => {
      this.filtro = productos;
      if(this.refrescando){
        this.refrescando.complete();
      }
    });
  }

  async openProduct(producto) {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: ShowProductPage,
      componentProps: {
        producto: producto
      }
    });
    modal.present();
  }

  filtrar(ev) {
    this.initializedItems();

    const valor = ev.target.value;

    if (!valor) {
      return
    }

    this.filtro = this.filtro.filter(producto => {
      if (producto.name && valor) {
        return (producto.name.toLowerCase().indexOf(valor.toLowerCase()) > -1);
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

  loadMore(event){
    if(this.productosService.getNext()){
      this.http.get(this.productosService.getNext(), {
        headers: this.authService.authHeader
      }).toPromise().then((response: any) =>{        
        this.productos.next(this.productos.value.concat(response.data));        
        if(!response.links.next){
          event.target.disabled = true;
        }
      }).catch(err =>{
        console.log(err);
      }).finally(() =>{
        event.target.complete();
      })
    }
  }

}
