import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, IonSlides, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { Usuario } from '../interface';
import { MapConfigPage } from '../map-config/map-config.page';
import { AuthenticationService } from '../servicios/authentication.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  

  @ViewChild('slidesconfig', { static: true }) protected slides: IonSlides;
  @ViewChild('mapconfig', { static: true }) protected map: ElementRef;

  user: Usuario = {
    profile: {
      firstname: '',
      lastname: '',
      bio: '',
      phone: '',
      image: '',      
    },
    address: {
      id: 1,
      state: {
        id: 1,
        name: 'Buenos Aires'
      },
      city: {
        id: 0,
        name: 'Gral. San Marín'
      },
      address: '',
      latitude: null,
      longitude: null,
    }
  }; 

  newUserImage = {
    name: '',
    filePath: ''
  }
  slideNumber = 0;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private authService: AuthenticationService,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private platform: Platform,
    private webview: WebView,
    private ref: ChangeDetectorRef,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    if(this.authService.user.getValue().profile !== null){
      Object.assign(this.user, this.authService.user.getValue());    
    }    
  }

  changeSlide(){      
    this.slides.slideTo(Number(this.slideNumber));    
  }

  async slidesChanged(event){    
    this.slideNumber = await this.slides.getActiveIndex();
  }

  goBack(){
    this.playSound();
    this.navCtrl.back();
  }

  async openMap(){
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: MapConfigPage,      
    });

    modal.present();

    modal.onWillDismiss().then(latLng =>{
      console.log(latLng);
    });
  }

  toggleSound(){
    this.playSound();
    this.smartAudio.toggleSound();
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }

   /*SELECCIONAR ORIGEN DE LA IMAGEN*/
   async selectImage() {
    this.playSound();    
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
    
    this.user.profile.image = this.pathForImage(filePath);
    
    this.ref.detectChanges(); // trigger change detection cycle

    this.newUserImage.name = name;
    this.newUserImage.filePath = filePath;    
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

  async save(){

    const formData = new FormData();
    formData.append('firstname', this.user.profile.firstname);
    formData.append('lastname', this.user.profile.lastname);
    formData.append('bio', this.user.profile.bio);
    formData.append('phone', this.user.profile.phone);
    this.authService.updateProfile(formData).subscribe(async (response) =>{
      console.log('hello');
      console.log(response);
    }, async (error) =>{
      console.log('jeyver error');
      console.log(error);
    });
    

  }

}
