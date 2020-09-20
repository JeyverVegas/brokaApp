import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonContent, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-chat-mensajes',
  templateUrl: './chat-mensajes.page.html',
  styleUrls: ['./chat-mensajes.page.scss'],
})
export class ChatMensajesPage implements OnInit {

  usuario = null;

  me = {
    id: 7,
    nombre: 'Jesus Vicuña',
    img: '../../assets/images/logo_inmobiliaria6.png',
  };

  nuevoMensaje = '';

  mensajes = [];

  @ViewChild(IonContent) content: IonContent;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    this.usuario = this.navParams.get('usuario');
    console.log(this.usuario);
    this.mensajes = [
      {
        usuario: this.me,
        mensaje: 'buenas tardes',
        createdAt: 1554090856000
      },
      {
        usuario: this.usuario,
        mensaje: 'buenas tardes, un gusto saludarle ¿como estas?',
        createdAt: 1554090956000
      },
      {
        usuario: this.me,
        mensaje: 'bien, bien quisiera consultarle acerca de...',
        createdAt: 1554091056000
      }
    ]
  }

  enviarMensaje() {
    this.mensajes.push({
      mensaje: this.nuevoMensaje,
      createdAt: new Date().getTime(),
      usuario: this.me
    });
    this.nuevoMensaje = "";

    setTimeout(()=>{
      this.content.scrollToBottom(200);
    })    
  }

  async uploadOptions(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: '¿Que desea cargar?',
      buttons: [
        {
          icon: 'image',
          text: 'Imagen'
        },
        {
          icon: 'document',
          text: 'Archivo "PDF"'
        }
      ]
    });

    actionSheet.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
