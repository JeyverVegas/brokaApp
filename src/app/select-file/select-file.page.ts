import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, IonContent, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ChatMessageImagesPage } from '../chat-message-images/chat-message-images.page';
import { ChatService } from '../servicios/chat.service';
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
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private smartAudio: SmartAudioService,
    private chatService: ChatService,    
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
        m.present().then(() => {
          this.modalCtrl.dismiss(null, null, 'selectfilemodal');
        })
      })
    }
  }

  async uploadFiles(event) {
    if (event.target.files) {
      const alerta = await this.alertCtrl.create({
        header: '¿Deseas enviar?',
        message: event.target.files.length + ' Archivos.',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.playSound();
            }
          },
          {
            text: 'Si',
            handler: async () => {
              this.playSound();
              const loading = await this.loadingCtrl.create({
                spinner: 'lines',
                message: 'Enviando...'
              });
              await loading.present();
              this.modalCtrl.dismiss();
              const formData = new FormData();
              for (let index = 0; index < event.target.files.length; index++) {
                const pdf = event.target.files[index];
                formData.append(`attachments[${index}]`, pdf, pdf.name);
              }

              let newMessage = {
                chat_id: this.chat.id,
                formData: formData
              }

              this.chatService.sendMessage(newMessage).then((response: any) => {
                this.chat.messages.push(response.data);
                setTimeout(() => {
                  this.content.scrollToBottom(200);
                });
              }).catch(err =>{
                console.log(err);
                this.presentToast('Ha ocurrido un error al enviar el mensaje.', 'danger');
              }).finally(() => {
                loading.dismiss();
              })
            }
          }
        ]
      });
      alerta.present();
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
