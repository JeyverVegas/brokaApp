import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSlides, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ChatService } from '../servicios/chat.service';

@Component({
  selector: 'app-chat-message-images',
  templateUrl: './chat-message-images.page.html',
  styleUrls: ['./chat-message-images.page.scss'],
})
export class ChatMessageImagesPage implements OnInit {

  @Input() imagesToShow: [];
  @Input() imagenes: [];
  @Input() chat: any;
  @Input() content: IonContent;

  @ViewChild('bottomslides', { static: true }) protected bottomSlides: IonSlides;
  @ViewChild('topslides', { static: true }) protected topSlides: IonSlides;

  mensaje = '';
  selectedImg = 0;

  slideOpts = {
    slidesPerView: 4,
    spaceBetween: 5
  }
  constructor(
    private modalctrl: ModalController,
    private chatService: ChatService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    console.log(this.imagenes);
    this.bottomSlides.update();
    this.topSlides.update();
  }

  async slideChanged() {
    this.selectedImg = await this.topSlides.getActiveIndex();
    this.bottomSlides.slideTo(await this.topSlides.getActiveIndex());
  }

  slideTo(index: number) {
    this.topSlides.slideTo(index);
  }

  closeModal() {
    this.modalctrl.dismiss();
  }

  async sendMessage() {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'enviando...',
      cssClass: 'custom-loading custom-loading-primary',
    });
    await loading.present();
    this.modalctrl.dismiss();
    const formData = new FormData();
    formData.append('content', this.mensaje);
    for (let index = 0; index < this.imagenes.length; index++) {
      const imagen: any = this.imagenes[index];
      formData.append(`attachments[${index}]`, imagen, imagen.name);
    }
    let message = {
      chat_id: this.chat.id,
      formData: formData
    }
    this.chatService.sendMessage(message).then((response: any) => {
      this.chat.messages.push(response.data);
      setTimeout(() => {
        this.content.scrollToBottom(200);
      });
    }).catch(err => {
      console.log(err);
      this.presentToast('Ha ocurrido un error al enviar el mensaje.', 'danger');
    }).finally(() => {
      this.imagesToShow.forEach(image => {
        URL.revokeObjectURL(image);
      })
      loading.dismiss();
    })
  }

  imgIsLoad(load: boolean) {
    if (load) {
      return true;
    } else {
      return false;
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      color: color,
      buttons: [
        {
          text: 'ok'
        }
      ],
      duration: 3000
    });
    toast.present();
  }

}
