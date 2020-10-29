import { Component, Input, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, ModalController } from '@ionic/angular';
import { SmartAudioService } from '../servicios/smart-audio.service';

declare var google:any;

@Component({
  selector: 'app-map-options',
  templateUrl: './map-options.page.html',
  styleUrls: ['./map-options.page.scss'],
})
export class MapOptionsPage implements OnInit {

  @Input() radius: number;  
  constructor(
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {    
  }

  closeModal(){
    this.playSound();
    this.modalCtrl.dismiss({position: false, cerrarMapa: false, radius: this.radius});
  }

  async meLocation(){
    this.playSound();
    let loading = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Obteniendo Ubicación.'
    });
    loading.present();    
    this.geolocation.getCurrentPosition().then(location =>{
      let currentPosition = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
      this.modalCtrl.dismiss({currentPosition: currentPosition, position: true, cerrarMapa: false, radius: this.radius}).then(()=>{
        loading.dismiss();
      });      
    }).catch(error =>{
      loading.dismiss();
      console.log(error);
    })
  }

  addKm() {
    this.radius++;        
  }

  removeKm() {
    this.radius--;    
  }

  cerrarMapa(){
    this.playSound();
    this.modalCtrl.dismiss({position: false, cerrarMapa: true, radius: this.radius});
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

}
