import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonContent, ModalController } from '@ionic/angular';
import { ChatMessageImagesPage } from '../chat-message-images/chat-message-images.page';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-select-file',
  templateUrl: './select-file.page.html',
  styleUrls: ['./select-file.page.scss'],
})
export class SelectFilePage implements OnInit {

  imagenes = [];
  @Input() chat: any;
  @Input() content: IonContent;  
  constructor(
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,    
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.playSound();
    this.modalCtrl.dismiss();
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

  async showImage(event) {
    if (event.target.files) {    
      for (let index = 0; index < event.target.files.length; index++) {
        const image = event.target.files[index];
        let imageUrl = URL.createObjectURL(image);        
        this.imagenes.push(imageUrl);
      }

      this.modalCtrl.create({
        component: ChatMessageImagesPage,
        componentProps: {
          imagesToShow: this.imagenes,
          imagenes: event.target.files,
          chat: this.chat,
          content: this.content
        }
      }).then(m => {
        m.present().then(() =>{
          this.modalCtrl.dismiss(null, null, 'selectfilemodal');
        })
      })
    }
  }

  uploadFiles(event) {
    console.log(event.target.files)
  }

}
