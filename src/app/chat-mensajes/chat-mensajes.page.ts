import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonGrid, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ChatImagesPreviewPage } from '../chat-images-preview/chat-images-preview.page';
import { SelectFilePage } from '../select-file/select-file.page';
import { AuthenticationService } from '../servicios/authentication.service';
import { ChatService } from '../servicios/chat.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-chat-mensajes',
  templateUrl: './chat-mensajes.page.html',
  styleUrls: ['./chat-mensajes.page.scss'],
})
export class ChatMensajesPage implements OnInit {

  @Input() usuario: any;
  @Input() chat: any;

  nuevoMensaje = '';
  loadOldMessages = false;
  mensajes = [];

  files = [];

  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonGrid) grid: IonGrid;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private authService: AuthenticationService,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private smartAudio: SmartAudioService,
    private chatService: ChatService
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      spinner: 'dots',
      message: 'Cargando Mensajes'
    });
    loading.present();
    this.http.get(this.authService.api + '/chats/' + this.chat.id + '/messages', { headers: this.authService.authHeader }).toPromise()
      .then((response: any) => {
        this.chat.messages = response.data;
        this.chat.messages.sort((a, b) => {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        });
        setTimeout(() => {
          this.content.scrollToBottom(200);
        }, 500);
        console.log(this.chat.messages);
        loading.dismiss();
      }).catch(err => {
        loading.dismiss();
        console.log(err);
      })
  }

  ionViewWillLeave() {
    this.chatService.markMessagesRead(this.chat.id);
    this.chatService.setNewMewssagesCount0();
  }

  doRefresh(event) {
    this.chatService.getMoreMessages(this.chat.messages[0].id, this.chat.id).then((response: { data: any[] }) => {
      if (response.data.length < 1) {
        event.target.disabled = true;
        return;
      }
      console.log(response);
      let oldMessages: any[] = response.data;
      oldMessages.sort((a, b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      });
      console.log('oldMessages', oldMessages);
      console.log('chatMessages', this.chat.messages);
      this.chat.messages.unshift(...oldMessages);
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      event.target.complete();
    });
  }

  allIsImage(attachments: any[]) {
    if (attachments) {
      var allimg = false;
      var re = /(?:\.([^.]+))?$/;
      attachments.forEach(attachment => {
        var extension = re.exec(attachment.url);
        if (extension[0] == '.jpeg' || extension[0] == '.png' || extension[0] == '.jpg') {
          allimg = true;
        } else {
          allimg = false;
        }
      })
      return allimg;
    }
  }

  openimagePreview(attachments: []) {
    this.modalCtrl.create({
      component: ChatImagesPreviewPage,
      componentProps: {
        images: attachments,
        chat: this.chat
      }
    }).then(m => m.present());
  }

  enviarMensaje() {
    this.playSound();

    const formData = new FormData();

    formData.append('content', this.nuevoMensaje);

    let newMessage = {
      formData: formData,
      chat_id: this.chat.id
    }

    this.chatService.sendMessage(newMessage).then((response: any) => {
      this.chat.messages.push(response.data);
      setTimeout(() => {
        this.content.scrollToBottom(200);
      });
    }).catch(err => {
      console.log(err);
    });

    this.nuevoMensaje = "";
  }

  imgIsLoad(load: boolean) {
    if (load) {
      return true;
    } else {
      return false;
    }
  }

  async presentToast(text, color) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000,
      color: color
    });
    toast.present();
  }

  /*SELECCIONAR ORIGEN DEL ARCHIVO*/
  async selectFile() {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: SelectFilePage,
      id: 'selectfilemodal',
      cssClass: 'select-file-modal',
      swipeToClose: true,
      mode: 'ios',
      componentProps: {
        chat: this.chat,
        content: this.content
      }
    });
    modal.present();
  }

  closeModal() {
    this.playSound();
    this.modalCtrl.dismiss();
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }
}
