import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatMensajesPage } from '../chat-mensajes/chat-mensajes.page';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  chats = [
    {
      id: 1,
      usuario: {
        id: 1,
        img: '../../assets/images/logo_inmobiliaria1.png',
        nombre: 'Inmobiliaria A'
      },
      ultMensaje: 'hola, buenos dias...',
      contador: 1
    },
    {
      id: 2,
      usuario: {
        id: 2,
        img: '../../assets/images/logo_inmobiliaria2.png',
        nombre: 'Inmobiliaria B'
      },
      ultMensaje: 'quisiera consultar acerca de.',
      contador: 0
    },
    {
      id: 3,
      usuario: {
        id: 3,
        img: '../../assets/images/logo_inmobiliaria3.png',
        nombre: 'Inmobiliaria C'
      },
      ultMensaje: 'Buenas noches, como estas?',
      contador: 0
    },
    {
      id: 4,
      usuario: {
        id: 4,
        img: '../../assets/images/logo_inmobiliaria4.png',
        nombre: 'Inmobiliaria D'
      },
      ultMensaje: 'Ahora no nos encontramos disponibles.',
      contador: 0
    },
    {
      id: 5,
      usuario: {
        id: 5,
        img: '../../assets/images/logo_inmobiliaria5.png',
        nombre: 'Inmobiliaria E'
      },
      ultMensaje: 'buenas tardes quisiera consultarle acerca de.',
      contador: 0
    },
    {
      id: 6,
      usuario: {
        id: 6,
        img: '../../assets/images/logo_inmobiliaria6.png',
        nombre: 'Inmobiliaria F'
      },
      ultMensaje: 'Bunos dias en estos momentos esa propiedad se encuentra ocupada pero su alquiler esta a punto de vencer.',
      contador: 0
    }
  ]

  constructor(
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService
  ) { }

  ngOnInit() {
  }

  async openChat(chat){
      this.playSound();
      const modal = await this.modalCtrl.create({
        component: ChatMensajesPage,
        componentProps: {
          usuario: chat.usuario
        }
      });

      modal.present();
  }
  
  playSound(){
    this.smartAudio.play('tabSwitch');
  }

}
