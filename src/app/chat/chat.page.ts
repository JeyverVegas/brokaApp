import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { error } from 'protractor';
import { BehaviorSubject } from 'rxjs';
import { ChatMensajesPage } from '../chat-mensajes/chat-mensajes.page';
import { AuthenticationService } from '../servicios/authentication.service';
import { ChatService } from '../servicios/chat.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {


  chats = new BehaviorSubject([]);

  constructor(
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private chatService: ChatService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.chats = await this.chatService.returnChats();
    console.log(this.chats.value);
    this.chatService.setNewMewssagesCount0();
  }

  doRefresh(event) {
    this.chatService.getChats(true).then(() => {
      event.target.complete();
    }).catch(err => {
      console.log(err);
    });
  }

  async openChat(chat) {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: ChatMensajesPage,
      componentProps: {
        usuario: this.authService.user,
        chat: chat
      }
    });
    modal.present();
  }

  imgIsLoad(load: boolean) {
    if (load) {
      return true;
    } else {
      return false;
    }
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

}
