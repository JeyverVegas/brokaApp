import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import Echo from 'laravel-echo';
import Pusher from "pusher-js";
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { SmartAudioService } from './smart-audio.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  Pusher = Pusher;
  private _echo: Echo = null;
  private newMessagesCount = new BehaviorSubject(0);
  private chats = new BehaviorSubject([]);

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient,
    private smartAudio: SmartAudioService,
  ) {
    this.loadInstace();
  }

  loadInstace() {
    this.authService.isAuthenticated.subscribe(async isLogin => {
      if (isLogin) {
        await this.getChats();
        this.setupEcho();
      }
    })
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

  async returnChats() {
    await this.getChats();
    return this.chats;
  }

  async getChats(chatPage?: boolean) {
    this.http.get(this.authService.api + '/chats', {
      headers: this.authService.authHeader
    }).toPromise().then((response: any) => {
      this.chats.next(response.data);
      if (!chatPage) {
        this.newMessagesCount.next(this.chats.getValue().reduce((suma, b) => suma + b.unread_messages_count, 0));
      }
    }).catch(err => {
      console.log(err);
    });
  }

  getNewMewssagesCount() {
    return this.newMessagesCount;
  }

  setNewMewssagesCount0() {
    this.newMessagesCount.next(0);
  }

  getMoreMessages(lastMessageId, chat_id) {
    return this.http.get(this.authService.api + '/chats/' + chat_id + '/messages?older_than_id=' + lastMessageId, {
      headers: this.authService.authHeader
    }).toPromise();
  }


  setupEcho() {
    this.echo.private('new-message.' + this.authService.user.id).listen('NewMessage', message => {
      this.playSound();
      const chat: any = this.chats.getValue().find(chat => chat.id == message.chat_id);
      chat.unread_messages_count = chat.unread_messages_count + 1;
      chat && chat.messages.push(message);
      this.newMessagesCount.next(this.newMessagesCount.value + 1);
    }).error(error => {
      console.log(error);
    });
  }

  sendMessage(newMessage: any) {
    return this.http.post(this.authService.api + '/chats/' + newMessage.chat_id + '/messages', newMessage.formData,
      { headers: this.authService.authHeader }).toPromise();
  }

  markMessagesRead(chatId: number) {
    this.http.put(this.authService.api + '/chats/' + chatId + '/messages/mark-as-read', null, {
      headers: this.authService.authHeader
    }).subscribe(response => {
      const chat: any = this.chats.getValue().find(chat => chat.id == chatId);
      chat.unread_messages_count = 0;
    }, error => {
      this.markMessagesRead(chatId);
    })
  }

  unistallEcho() {
    this.echo.private('new-message.' + this.authService.user.id).stopListening('NewMessage');
    this.echo.leaveChannel('new-message.' + this.authService.user.id);
  }

  playSound() {
    this.smartAudio.play('chatsound');
  }





}
