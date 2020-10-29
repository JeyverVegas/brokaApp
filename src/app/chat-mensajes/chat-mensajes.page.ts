import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, IonContent, LoadingController, ModalController, NavParams, Platform, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
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

  mensajes = [];

  files = [];

  @ViewChild(IonContent) content: IonContent;

  constructor(    
    private modalCtrl: ModalController,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private platform: Platform,
    private ref: ChangeDetectorRef,
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
    this.http.get(this.authService.api + '/chats/'+ this.chat.id + '/messages', { headers: this.authService.authHeader}).toPromise()
    .then((response: any) =>{
      this.chat.messages = response.data;      
      this.chat.messages.sort((a, b) => {
        return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
      });            
      setTimeout(() => {
        this.content.scrollToBottom(200);
      });      
      loading.dismiss();
    }).catch(err =>{
      loading.dismiss();
      console.log(err);
    })
  }

  doRefresh(event){
    this.chatService.getMoreMessages(this.chat.messages[0].id, this.chat.id).then((response: any)=>{
      let oldMessages:[any] = response.data;
      oldMessages.sort((a, b) => {
        return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
      });      
      this.chat.messages.unshift(...oldMessages);      
      event.target.complete();
    }).catch(error =>{
      console.log(error);
    });    
  }

  enviarMensaje() {
    this.playSound();    

    let newMessage = {
      content: this.nuevoMensaje,
      chat_id: this.chat.id
    }

    this.chatService.sendMessage(newMessage).then((response: any) => {      
      this.chat.messages.push(response.data);
      setTimeout(() => {
        this.content.scrollToBottom(200);
      });
    }).catch(err =>{
      console.log(err);
    });

    this.nuevoMensaje = "";
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
    const actionSheet = await this.actionSheetController.create({
      header: "Adjunte un Archivo:",
      buttons: [{
        text: 'Galeria',
        icon: 'image-outline',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Camara',
        icon: 'camera-outline',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'PDF',
        icon: 'document-outline'
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  /*OBTENGO LA IMAGEN*/
  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {

      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {

        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });

      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });
  }

  /*CREO EL NUEVO NOMBRE DE LA IMAGEN*/
  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  /*COPIO LA IMAGEN AL DIRECTORIO DE LA APP*/
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.', 'danger');
    });
  }

  /*ACTUALIZO LA EL ARRAY CON LOS ARCHIVOS*/

  updateStoredImages(name) {
    let file = {
      name: name,
      filePath: this.file.dataDirectory + name,
      resPath: this.pathForImage(this.file.dataDirectory + name),
      type: 'img'
    }

    this.files = [file, ...this.files];
    this.ref.detectChanges(); // trigger change detection cycle    
  }

  /*Empiezo la Subida de la imagen al servidor*/
  startUpload() {
    /*Paso la url de la imagen y esot me devuelve la imagen como tal*/
    if (this.files.length > 0) {
      var filesReal = [];
      for (let [index, imgEntry] of this.files.entries()) {
        this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
          .then(entry => {
            (<FileEntry>entry).file(file => {
              filesReal.push(file);
              if (this.files.length === index) {
                this.readFile(filesReal);
              }

            })
          })
          .catch(err => {
            this.presentToast('Error while reading file.', 'danger');
          });
      }
    }
  }

  /*UNA VE TENGO LA IMAGEN LA LEO Y LA INSERTO DENTRO DE UN INPUT DE TIPO FILE*/
  readFile(files: any) {
    for (let [index, file] of this.files.entries()) {
      const reader = new FileReader();
      reader.onload = () => {
        const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
          type: file.type
        });
        /*UNA VEZ AGREGO LA IMAGEN AL INPUT DE TIPO FILE, INSERTO EL INPUT DENTRO DEL FORMULARIO*/
        formData.append(`files[${index}]`, imgBlob, file.name);
        if(this.files.length === index){
          this.uploadImageData(formData);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  /*UNA VEZ EL FORMULARIO ESTA CREADO COMIENZA LA SUBIDA DE LA IMAGEN AL SERVIDOR POR MEDIO DE UNA PETICION HTTP DE TIPO POST*/
  async uploadImageData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo imagen...',
    });
    await loading.present();

    this.http.post("http://192.168.0.100/upload-image/upload.php", formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        if (res['success']) {
          this.presentToast('La Imagen se ha cargado correctamente.', 'primary');
        } else {
          this.presentToast('Ha fallado la carga de la imagen.', 'danger');
        }
      });
  }

  closeModal() {
    this.playSound();
    this.modalCtrl.dismiss();
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }

}
