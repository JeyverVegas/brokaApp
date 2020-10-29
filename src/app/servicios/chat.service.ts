import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import Echo from 'laravel-echo';
import Pusher from "pusher-js";
import { BehaviorSubject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { SmartAudioService } from './smart-audio.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  Pusher = Pusher;
  private _echo:Echo = null;

  chats = new BehaviorSubject([]);

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient,
    private smartAudio: SmartAudioService,
    private loadingCtrl: LoadingController
  ) {
    this.loadInstace();
  }

  loadInstace() {
    if (!this.authService.isAuthenticated.getValue()) {
      return;
    }            
    this.setupEcho();    
  }

  get echo() {
    if (this._echo === null) {      
      this._echo = new Echo({
        broadcaster: 'pusher',
        key: 'ESoxCQSgq67UIvdJ2KeNgbT3Sd1ryp4wVw1iHD5d1a3O0QCxF9OIPlEuwFludJXy',
        wsHost: this.authService.host,
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        authorizer: (channel, options) => {
          return {
            authorize: (socketId, callback) => {
              this.http.post(this.authService.api + '/broadcasting/auth', {
                socket_id: socketId,
                channel_name: channel.name
              }, {
                headers: this.authService.authHeader
              }).toPromise()
                .then((response) => {
                  callback(false, response);
                })
                .catch(error => {
                  callback(true, error);
                });
            }
          };
        },
      });
    }
    return this._echo;
  }


  async getChats() {
    const loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Cargando Chats...'
    });
    loading.present();
    this.http.get(this.authService.api + '/chats', {
      headers: this.authService.authHeader
    }).toPromise().then((response: any) => {      
      this.chats.next(response.data);
      loading.dismiss();
    }).catch(err => {
      loading.dismiss();
      console.log(err);
    });
  }

  getMoreMessages(lastMessageId, chat_id){
    return this.http.get(this.authService.api + '/chats/'+ chat_id + '/messages?older_than_id=' +  lastMessageId, {
      headers: this.authService.authHeader
    }).toPromise();
  }


  setupEcho() {    
    this.echo.private('new-message.' + this.authService.user.id).listen('NewMessage', message => {      
      this.playSound();
      const chat: any = this.chats.getValue().find(chat => chat.id == message.chat_id);
      chat && chat.messages.push(message);
    }).error(error =>{
      console.log(error);
    });
  }

  sendMessage(newMessage) {    
    return this.http.post(this.authService.api + '/chats/' + newMessage.chat_id + '/messages', { content: newMessage.content },
      { headers: this.authService.authHeader }).toPromise();
  }

  playSound() {
    this.smartAudio.play('chatsound');
  }





}