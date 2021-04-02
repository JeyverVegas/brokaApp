import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Filtros2Page } from '../filtros2/filtros2.page';
import { googleMapsControlOpts } from '../interface';
import { AuthenticationService } from '../servicios/authentication.service';
import { ChatService } from '../servicios/chat.service';
import { GoogleMapsApiService } from '../servicios/google-maps-api.service';
import { MatchService } from '../servicios/match.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  @ViewChildren('mapa') protected mapas: QueryList<ElementRef>;
  @ViewChildren('containerx') protected containerx: QueryList<ElementRef>;
  productos = new BehaviorSubject([]);
  total = new BehaviorSubject(0);
  MapBrokaControls: googleMapsControlOpts = {
    showMyPositionButton: false,
    showRadiusButton: false,
    draggable: false,
    zoom: 15
  }

  deviceWidth = null;
  showdelete = false;
  showmatch = false;
  showAlert = false;

  searchName: string = '';

  canSave = false;

  guardarBusqueda = false;
  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthenticationService,
    private matchService: MatchService,
    private router: Router,
    private chatService: ChatService,
    private googleMapsApi: GoogleMapsApiService
  ) { }

  async ngOnInit() {
    this.productos = await this.productosService.getProducts();
    this.mapas.changes.subscribe((elements: any) => {
      var mapas: any[] = elements.toArray();

      mapas.forEach((mapa: ElementRef) => {
        const map = mapa.nativeElement;
        const product = this.productos.getValue()[Number(map.dataset.index)];
        this.crearMapa(map, product, Number(map.dataset.index));
      })
    });
  }

  async ionViewDidEnter() {

  }

  crearMapa(mapa, product, index) {
    if (google) {
      var map = new google.maps.Map(mapa, {
        center: { lat: product.address.latitude, lng: product.address.longitude },
        zoom: 15,
        mapTypeControl: false,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        draggable: false
      });

      map.addListener('drag', () => {
        const element: HTMLElement = this.containerx.toArray().find(elements => Number(elements.nativeElement.dataset.index) == index).nativeElement;
        element.style.overflow = "hidden";
      });

      map.addListener('dragstart', () => {
        const element: HTMLElement = this.containerx.toArray().find(elements => Number(elements.nativeElement.dataset.index) == index).nativeElement;
        element.style.overflow = "hidden";
      });

      map.addListener('dragend', () => {
        const element: HTMLElement = this.containerx.toArray().find(elements => Number(elements.nativeElement.dataset.index) == index).nativeElement;
        element.style.overflow = "auto";
      })
      var brokaMarkerClass = this.googleMapsApi.getBrokaMarker();
      var marker = new brokaMarkerClass(
        new google.maps.LatLng(product.address.latitude, product.address.longitude),
        product.images[0].url
      );

      marker.setMap(map);
    }
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

  async abriFiltros() {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: Filtros2Page
    });

    modal.present();
  }

  async toggleSaveSearch() {
    this.playSound();

    this.showAlert = !this.showAlert;

    if (!this.showAlert) {
      this.searchName = '';
      this.guardarBusqueda = false;
      this.canSave = false;
    }
  }

  saveSearch() {
    this.playSound();
    this.authService.saveSearch(this.searchName, this.productosService.filtros).then(() => {
      this.guardarBusqueda = true;
    }).catch(err => {
      console.log(err);
    });
  }

  tipiando(event) {
    let name: string = event.target.value;
    if (name.length > 0) {
      this.canSave = true;
    } else {
      this.canSave = false;
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
        message: 'Para poder darle me gusta a una propiedad y que quede en tu listado, tenes que completar el perfil.',
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

  async restoreAll() {
    this.playSound();
    const alerta = await this.alertCtrl.create({
      header: '¿Quieres reestablecer todos los inmuebles?',
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
              spinner: 'lines',
              message: 'Reestablenciendo todos los inmuebles...'
            });
            await loading.present();
            this.productosService.removerAllDiscartedProducts().then(response => {
              this.presentToast('Se han reestablecido todos los inmuebles ;)', 'secondary');
            }).catch(err => {
              console.log(err);
              this.presentToast('Ha ocurrido un error al reestablecer los inmuebles :(', 'danger');
            }).finally(() => {
              loading.dismiss();
            })
          }
        }
      ]
    });
    alerta.present();
  }

  async doRefresh(event) {
    await this.productosService.getProducts();
    event.target.complete();
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

  async presentToast(text, color) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000,
      color: color,
      buttons: [
        'ok'
      ]
    });
    toast.present();
  }

}
