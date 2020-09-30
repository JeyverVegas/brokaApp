import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit {

  guardarBusqueda = false;

  constructor(
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService
  ) { }

  ngOnInit() {
  }

  closeModal(){
    this.playSound();
    this.modalCtrl.dismiss();
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }


}
