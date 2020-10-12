import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { Router } from '@angular/router';
import { AuthenticationService } from '../servicios/authentication.service';
import { Usuario } from '../interface';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  user = {} as Usuario;

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
    private http: HttpClient,    
    private smartAudio: SmartAudioService,
    private modalCtrl: ModalController,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {    
    this.silenciar = this.smartAudio.getMute();
    this.user = this.authService.user;
    console.log(this.authService.token);
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }

  async logOut() {    
    this.playSound();
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'cerrando sesion',
      duration: 3000
    });

    await loading.present();

    await this.authService.logOut().then(() =>{
      loading.onWillDismiss().then(() => {
        this.router. navigateByUrl('/login', {replaceUrl: true});
      });
    });    
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
    
    if(this.target == 'usuario'){
      this.user.profile.image = this.pathForImage(filePath);
    }else{
      //this.user.profile.profile_images.push(this.pathForImage(filePath))
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
      formData.append('file', imgBlob, file.name);
      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
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
  
  async openPreview(img){
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      cssClass: 'b_transparent',
      componentProps: {
        img: img
      }
    });

    modal.present();
  }


}
