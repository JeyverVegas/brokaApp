import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-chat-images-preview',
  templateUrl: './chat-images-preview.page.html',
  styleUrls: ['./chat-images-preview.page.scss'],
})
export class ChatImagesPreviewPage implements OnInit {

  @Input() images: [];
  @Input() chat: any;

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
