import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ChatMensajesPage } from '../chat-mensajes/chat-mensajes.page';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { Match } from '../interface';
import { AuthenticationService } from '../servicios/authentication.service';
import { ChatService } from '../servicios/chat.service';
import { MatchService } from '../servicios/match.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-mis-matchs',
  templateUrl: './mis-matchs.page.html',
  styleUrls: ['./mis-matchs.page.scss'],
})
export class MisMatchsPage {

  misMatchs: Match[] = [];

  constructor(
    private matchService: MatchService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private authService: AuthenticationService,
    private chatService: ChatService
  ) { }

  async ionViewDidEnter() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Cargando...'
    });

    loading.present();

    this.matchService.getMatchs().then((response: { data: Match[] }) => {
      this.misMatchs = response.data;
      this.chatService.returnChats().subscribe(chats => {
        console.log(chats);
      });
      console.log(response);
      loading.dismiss();
    }).catch(err => {
      console.log(err);
      loading.dismiss();
    })
  }

  async openPreview(image) {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      cssClass: 'b_transparent',
      componentProps: {
        img: image
      }
    });

    modal.present();
  }

  deleteAllMatchs() {
    this.playSound();
    this.alertCtrl.create({
      header: '¿Estas seguro?',
      message: 'Se van a eliminar todos los matchs y no podras recuperarlos.',
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
              spinner: 'bubbles',
              message: 'Cargando...'
            });

            loading.present();

            this.matchService.deleteAllMatch().then(response => {
              console.log(response);
              this.misMatchs = [];
              this.presentToast('Todos tus matchs han sido eliminados.', 'primary');
            }).catch(err => {
              console.log(err);
              this.presentToast('Ha ocurrido un error al eliminar los matchs.', 'danger');
            }).finally(() => {
              loading.dismiss();
            })
          }
        }
      ]
    }).then(a => a.present());
  }

  deleteMatch(match: Match) {
    this.playSound();
    this.alertCtrl.create({
      header: '¿Estas seguro?',
      message: 'quieres eliminar el match con: ' + match.property.name + '.',
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
              spinner: 'bubbles',
              message: 'Cargando...'
            });

            loading.present();

            this.matchService.deleteMatch(match.id).then(response => {
              console.log(response);
              for (let [index, m] of this.misMatchs.entries()) {
                if (m.id === match.id) {
                  this.misMatchs.splice(index, 1);
                }
              }
              this.presentToast('El match ha sido eliminado.', 'primary');
            }).catch(err => {
              console.log(err);
              this.presentToast('Ha ocurrido un error al eliminar el match.', 'danger');
            }).finally(() => {
              loading.dismiss();
            })
          }
        }
      ]
    }).then(a => a.present());
  }

  async openChat(match: Match) {
    this.playSound();
    const chat = this.chatService.returnChats().value.find(chats => chats.type === 'private' && chats.userIds.includes(match.property.realEstateAgency.user_id))
    const modal = await this.modalCtrl.create({
      component: ChatMensajesPage,
      componentProps: {
        usuario: this.authService.user,
        chat: chat
      }
    });
    modal.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      color: color,
      mode: 'ios',
      buttons: [
        {
          text: 'ok'
        }
      ],
      duration: 3000
    });
    toast.present();
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }



}
