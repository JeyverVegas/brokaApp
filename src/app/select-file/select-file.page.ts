import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
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
    private webview: WebView,
    private camera: Camera,
    private file: File,
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

  /*CONVIERTO LA URL NATIVA A URL DE NAVEGADOR*/
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  /*OBTENGO LA IMAGEN*/
  takePhotoFromCamera() {
    this.playSound();
    var options: CameraOptions = {
      quality: 30,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {

      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

    });
  }

  /*COPIO LA IMAGEN AL DIRECTORIO DE LA APP*/
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.sendForPreview(newFileName);
    }, error => {
      this.presentToast('Error while storing file.', 'danger');
    });
  }

  /*CREO EL NUEVO NOMBRE DE LA IMAGEN*/
  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  /*ENVIO LA IMAGEN AL PREVIEW*/

  sendForPreview(name) {
    let imagen = {
      name: name,
      filePath: this.file.dataDirectory + name,
      type: 'img'
    };

    this.imagenes.push(this.pathForImage(this.file.dataDirectory + name));

    this.file.resolveLocalFilesystemUrl(imagen.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => {
          this.readFile(file);
        })
      })
      .catch(err => {
        this.presentToast('Error while reading file.', 'danger');
      });    
  }

  /*UNA VEz TENGO LA IMAGEN LA LEO Y LA ENVIO A LA PANTALLA DEL PREVIEW*/
  readFile(file: any) {

    const reader = new FileReader();
    reader.onload = () => {
      const imagen = [new Blob([reader.result], {
        type: file.type,        
      })];

      this.modalCtrl.create({
        component: ChatMessageImagesPage,
        componentProps: {
          imagesToShow: this.imagenes,
          imagenes: imagen,
          chat: this.chat,
          content: this.content
        }
      }).then(m => {
        m.present().then(() => {
          this.modalCtrl.dismiss(null, null, 'selectfilemodal');
        })
      })
    };
    reader.readAsArrayBuffer(file);
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
              }).catch(err => {
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
