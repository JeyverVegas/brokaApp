import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ProductosService } from '../servicios/productos.service';
import { } from 'googlemaps';
import { GoogleMapsApiService } from '../servicios/google-maps-api.service';
import { googleMapsControlOpts } from '../interface';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { AuthenticationService } from '../servicios/authentication.service';
import { MatchService } from '../servicios/match.service';
import { ChatService } from '../servicios/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.page.html',
  styleUrls: ['./property-card.page.scss'],
})
export class PropertyCardPage implements OnInit {

  @Input() property: any;

  @ViewChild('googlemapproduct', { static: true }) mapElement: ElementRef

  map: google.maps.Map;

  productMarker: any;

  showdelete = false;
  showmatch = false;

  @Input() showMatchDiscardButtons: boolean = true;

  MapBrokaControls: googleMapsControlOpts = {
    showMyPositionButton: false,
    showRadiusButton: false,
    draggable: false,
    zoom: 15
  }

  constructor(
    private modalCtrl: ModalController,
    private productosService: ProductosService,
    private googleMapsApiService: GoogleMapsApiService,
    private smartAudio: SmartAudioService,
    private toastController: ToastController,
    private authService: AuthenticationService,
    private matchService: MatchService,
    private chatService: ChatService,
    private alertCtrl: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if (google) {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: this.property.address.latitude, lng: this.property.address.longitude },
        zoom: 15,
        mapTypeControl: false,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        draggable: false
      });
      this.setMarker();
    }
  }

  setMarker(map?) {
    var brokaMarkerClass = this.googleMapsApiService.getBrokaMarker();
    this.productMarker = new brokaMarkerClass(
      new google.maps.LatLng(this.property.address.latitude, this.property.address.longitude),
      this.property.images[0].url,
      null,
      false
    );
    this.productMarker.setMap(this.map);
  }

  async matchear() {
    this.playSound();

    if (this.authService.user.profile) {
      this.playSound();
      this.showmatch = true;
      this.matchService.storeMatch({ property_id: this.property.id }).then(response => {
        this.chatService.getChats();
        this.modalCtrl.dismiss({ deleteProperty: true }).then(() => {
          this.presentToast('Se ha matcheado exitosamente la propiedad.', 'success');
        })
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
              this.modalCtrl.dismiss().then(() => {
                this.router.navigateByUrl('/user-profile');
              });
            }
          }
        ]
      }).then(a => a.present());
    }
  }

  async descartar() {
    this.playSound();
    this.showdelete = true;
    this.productosService.discardProduct(this.property.id).then(response => {
      this.modalCtrl.dismiss({ deleteProperty: true }).then(m => {
        this.presentToast('Se ha descartado el inmueble satisfactoriamente.', 'success');
      })
    }).catch(error => {
      console.log(error);
      this.presentToast('Ha ocurrido un error al descartar el inmueble intentelo mas tarde.', 'danger');
    }).finally(() => {
      this.showdelete = false;
    });
  }



  closeModal() {
    this.modalCtrl.dismiss();
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

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

}
