import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { error } from 'protractor';
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

    
  chats = [];

  constructor(
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,    
    private chatService: ChatService,
    private authService: AuthenticationService,    
  ) { }

  ngOnInit() {    
    
  }

  ionViewWillEnter(){    
    this.chatService.getChats();    
    this.chatService.chats.subscribe(chats =>{
      this.chats = chats;      
    }, error =>{
      console.log(error);
    });
  }

  doRefresh(event){
    this.chatService.getChats().then(()=>{
      event.target.complete();
    }).catch(err =>{
      console.log(err);     
    });
  }

  async openChat(chat){
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
  
  playSound(){
    this.smartAudio.play('tabSwitch');
  }  

}
