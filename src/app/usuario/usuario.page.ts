import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { Router } from '@angular/router';
import { AuthenticationService } from '../servicios/authentication.service';
import { Usuario } from '../interface';
import { Storage } from '@ionic/storage';
import { ChatService } from '../servicios/chat.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { BehaviorSubject } from 'rxjs';
import { MatchService } from '../servicios/match.service';
import { ProductosService } from '../servicios/productos.service';

const USER_DATA = 'user-data';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  user = {} as Usuario;
  chatCount: any = 0;
  loadingChatCount = true;
  matchCount: any = 0;
  loadingMatchCount = true;
  discardCount: any = 0;
  loadingDiscardCount = true;

  profileImages = [];
  silenciar = false;

  target = null;

  constructor(
    private loadingCtrl: LoadingController,
    private webview: WebView,
    private router: Router,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private platform: Platform,
    private ref: ChangeDetectorRef,
    private smartAudio: SmartAudioService,
    private modalCtrl: ModalController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private authService: AuthenticationService,
    private chatService: ChatService,
    private matchService: MatchService,
    private productosService: ProductosService,
    private oneSignal: OneSignal,
  ) { }

  async ngOnInit() {
    this.user = this.authService.user;
    console.log(this.user);
  }

  async ionViewDidEnter() {
    try {

      this.chatCount = await (await this.chatService.returnChats()).getValue().length;
      this.loadingChatCount = false;
      this.matchCount = await (await this.matchService.getMatchs()).data.length;
      this.loadingMatchCount = false;
      this.discardCount = await (await this.productosService.getDescartados()).length;
      this.loadingDiscardCount = false;
    } catch (error) {
      this.presentToast('ha ocurrido un error al cargar, por favor intente mas tarde', 'danger');
      console.log(error);
    }
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

  async deleteImgGallery(imageId: number) {
    this.playSound();
    const alerta = await this.alertCtrl.create({
      header: "¿Estas Seguro?",
      message: '¿Quieres eliminar la imagen?',
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
            const loading = await this.loadingCtrl.create({
              spinner: 'lines',
              message: 'Eliminando Imagen...'
            });
            await loading.present();
            this.authService.deleteImgGallery(imageId).then((response: any) => {
              this.presentToast('La imagen ha sido eliminada exitosamente.', 'secondary');
              for (let [index, img] of this.profileImages.entries()) {
                if (img.id === imageId) {
                  this.user.profile.profile_images.splice(index, 1);
                }
              }
            }).catch(err => {
              this.presentToast('Ha ocurrido un error al eliminar la imagen.', 'danger');
            }).finally(async () => {
              await loading.dismiss();
            })
          }
        }
      ]
    });
    alerta.present();
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

  /*SELECCIONAR ORIGEN DE LA IMAGEN*/
  async selectImage(target) {
    this.playSound();
    this.target = target;
    const actionSheet = await this.actionSheetController.create({
      header: "Cargar desde:",
      buttons: [{
        text: 'Abrir Galeria',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Usar Camara',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
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

  /*ACTUALIZO LA IMAGEN DEL USUARIO CON LA URL DE LA IMAGEN EN EL EQUIPO*/
  updateStoredImages(name) {
    let filePath = this.file.dataDirectory + name;

    if (this.target == 'usuario') {
      this.user.profile.image = this.pathForImage(filePath);
    }
    this.ref.detectChanges(); // trigger change detection cycle

    this.startUpload({ name: name, filePath: filePath });
  }

  /*Empiezo la Subida de la imagen al servidor*/
  startUpload(imgEntry) {
    /*Paso la url de la imagen y esot me devuelve la imagen como tal*/
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file))
      })
      .catch(err => {
        this.presentToast('Error while reading file.', 'danger');
      });
  }

  /*UNA VE TENGO LA IMAGEN LA LEO Y LA INSERTO DENTRO DE UN INPUT DE TIPO FILE*/
  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      /*UNA VEZ AGREGO LA IMAGEN AL INPUT DE TIPO FILE, INSERTO EL INPUT DENTRO DEL FORMULARIO*/
      if (this.target == 'usuario') {
        formData.append('image', imgBlob, file.name);
        formData.append('_method', 'put');
      } else {
        formData.append('images[]', imgBlob);
      }

      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  /*UNA VEZ EL FORMULARIO ESTA CREADO COMIENZA LA SUBIDA DE LA IMAGEN AL SERVIDOR POR MEDIO DE UNA PETICION HTTP DE TIPO POST*/
  async uploadImageData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Cargando Imagen.'
    });
    loading.present();
    if (this.target == 'usuario') {
      this.authService.updateProfileImage(formData, this.user.profile.id).then((response: { data: any }) => {
        this.user.profile = response.data;
        this.authService.user.profile = this.user.profile;
        this.storage.set(USER_DATA, this.user);
        this.ref.detectChanges()
        loading.dismiss();
        this.presentToast('la imagen de usuario ha sido actualizada.', 'secondary', false);
      }).catch(err => {
        loading.dismiss();
        this.presentToast('Ha ocurrido un error al actualizar la imagen', 'danger', false);
      });
      loading.dismiss();
    } else {
      this.authService.updateGalleryImages(formData).then((response: { data: any[] }) => {
        this.user.profile.profile_images.push(response.data[0]);
        this.authService.user = this.user;
        this.storage.set(USER_DATA, this.user);
        this.ref.detectChanges();
        loading.dismiss();
        this.presentToast('la imagen ha sido añadida exitosamente ;).', 'secondary', false);
      }).catch(err => {
        this.presentToast('Ha ocurrido un error al añadir la imagen', 'danger', false);
        loading.dismiss();
      });
    }
  }

  async presentToast(mensaje: string, color: string, redireciona?: boolean, urlPath?: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 3000,
      mode: 'ios',
      buttons: ['Ok']
    });

    toast.present();

    if (redireciona) {
      toast.onDidDismiss().then(() => {
        this.router.navigateByUrl(urlPath, { replaceUrl: true });
      });
    }
  }

  async openPreview(img) {
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      cssClass: 'b_transparent',
      componentProps: {
        img: img
      }
    });

    modal.present();
  }

  async logOut() {
    this.playSound();
    const alerta = await this.alertCtrl.create({
      header: '¿Cerrar Sesión?',
      message: '¿Deseas cerrar la sesión actual?',
      buttons: [
        {
          text: "No",
          handler: () => {
            this.playSound();
          }
        },
        {
          text: "Si",
          handler: async () => {
            this.playSound();
            const loading = await this.loadingCtrl.create({
              spinner: 'crescent',
              message: 'Cerrando Sesión.',
            });
            await loading.present();
            this.chatService.unistallEcho();
            await this.authService.logOut().then(() => {
              this.oneSignal.removeExternalUserId();
              loading.dismiss().then(() => {
                this.router.navigateByUrl('/login', { replaceUrl: true });
              });
            });
          }
        }
      ]
    });

    await alerta.present();
  }


}
