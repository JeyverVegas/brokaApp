import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, IonSlides, LoadingController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { City, State, Usuario } from '../interface';
import { MapConfigPage } from '../map-config/map-config.page';
import { AddressService } from '../servicios/address.service';
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
  @ViewChild('slidessteps', { static: true }) protected slidesSteps: IonSlides;
  
  slideOpts = {
    allowTouchMove: false,
    //autoHeight: true,    
  }
  
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
      state: null,
      city: null,
      address: '',
      latitude: null,
      longitude: null,
    }
  };

  error = {
    message: '',
    errors: {},
    displayError: false
  }

  cities = [] as City[];
  states = [] as State[];

  newUserImage = {
    name: '',
    filePath: '',
    blob: null
  }
  slideNumber = 0;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private authService: AuthenticationService,
    private addressService: AddressService,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private platform: Platform,
    private webview: WebView,
    private ref: ChangeDetectorRef,
    private toastController: ToastController,
    private loadingCtrl: LoadingController    
  ) { }

  async ngOnInit() {
    let loading = await this.loadingCtrl.create({
      message: 'Cargando datos...',
      spinner: 'bubbles'
    });
    await loading.present();
    try {
      console.log(this.authService.user);
      console.log(this.user);
      this.states = await this.addressService.getStates();
      if (this.authService.user.profile !== null) {
        Object.assign(this.user.profile, this.authService.user.profile);
      }

      if (this.authService.user.address !== null) {
        this.user.address = this.authService.user.address;
      } else {
        this.user.address = {
          id: 1,
          state: this.states[0],          
          address: '',
          latitude: null,
          longitude: null,
        }
      }
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      alert(JSON.stringify(error));
    }
  }


  async setState(event) {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'cargando partidos...'
    })
    await loading.present();
    try {
      let state = event.target.value;      
      this.cities = await this.addressService.getCities(state.id);      
      if(this.cities.length > 0){
        this.user.address.city = this.cities[0];
      }else{
        this.user.address.city = null;
      }            
      this.user.address.state = state;
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      console.log(error);
    }
  }

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };



  changeSlide() {
    this.slides.slideTo(Number(this.slideNumber));
  }

  async slidesChanged(event) {
    this.slideNumber = await this.slides.getActiveIndex();
  }

  goBack() {
    this.playSound();
    this.navCtrl.back();
  }

  async openMap() {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: MapConfigPage,
    });

    modal.present();

    modal.onWillDismiss().then(response => {
      this.user.address.latitude = response.data.lat;
      this.user.address.longitude = response.data.lng;
    });
  }

  toggleSound() {
    this.playSound();
    this.smartAudio.toggleSound();
  }

  playSound() {
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
    try {
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
    } catch (e) {
      alert(JSON.stringify(e));
    }
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

    this.file.resolveLocalFilesystemUrl(this.newUserImage.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file))
      })
      .catch(err => {
        this.presentToast('Error while reading file.', 'danger');
      });
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      this.newUserImage.blob = imgBlob;
      this.newUserImage.name = file.name;
    };
    reader.readAsArrayBuffer(file);
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

  async saveProfile() {
    const loading = await this.loadingCtrl.create({
      message: 'Guardando Información',
      spinner: 'bubbles'
    });

    await loading.present();

    const formData = new FormData();
    formData.append('firstname', this.user.profile.firstname);
    formData.append('lastname', this.user.profile.lastname);
    formData.append('bio', this.user.profile.bio);
    formData.append('phone', this.user.profile.phone);
    console.log(formData.get('firstname'))
    console.log(formData.get('lastname'))

    if (this.authService.user.profile === null) {
      if (this.newUserImage.blob !== null) {
        formData.append('image', this.newUserImage.blob, this.newUserImage.name);
      }
      this.authService.addProfile(formData).subscribe(async (response) => {
        await loading.dismiss();
        this.error.displayError = false;
        this.saveAddress();
      }, async (error) => {
        await loading.dismiss();
        this.error.message = error.error.message;
        this.error.errors = error.error.errors;
        this.error.displayError = true;
        this.presentToast(this.firstError, 'danger');
      });
    }
    else {
      if (this.newUserImage.blob !== null) {
        formData.append('image', this.newUserImage.blob, this.newUserImage.name);
      }
      formData.append('_method', 'put');
      this.authService.updateProfile(formData).subscribe(async (response) => {
        await loading.dismiss();
        this.saveAddress();
      }, async (error) => {
        await loading.dismiss();
        this.error.message = error.error.message;
        this.error.errors = error.error.errors;
        this.error.displayError = true;
        this.presentToast(this.firstError, 'danger');
      });
    }
  }

  async saveAddress() {

    const loading = await this.loadingCtrl.create({
      message: 'Guardando Ubicación...',
      spinner: 'bubbles'
    });

    await loading.present();

    let address = {
      latitude: this.user.address.latitude,
      longitude: this.user.address.longitude,
      address: this.user.address.address,
      state_id: this.user.address.state.id,
      city_id: this.user.address.city.id
    }

    if (this.authService.user.address === null) {
      console.log('soy nulo');

      this.authService.addAddress(address).subscribe(async (response) => {
        await loading.dismiss();
        this.presentToast('La informacion ha sido guardada exitosamente.', 'success');
      }, async (error) => {
        this.error.message = error.error.message;
        this.error.errors = error.error.errors;
        //this.error.displayError = true;
        this.presentToast(this.firstError, 'danger');
        await loading.dismiss();

      });
    } else {
      this.authService.updateAddress(address).subscribe(async (response) => {
        await loading.dismiss();
        this.presentToast('La informacion ha sido guardada exitosamente.', 'success');
      }, async (error) => {
        console.log(error);
        this.error.message = error.error.message;
        this.error.errors = error.error.errors;
        this.error.displayError = true;
        this.presentToast(this.firstError, 'danger');
        await loading.dismiss();

      });
    }
  }

  public get errorList() {
    return Object.entries(this.error.errors)
      .reduce((acum, [_, value]) => acum.concat(value), []);
  }

  public get firstError() {
    return this.errorList[0];
  }

  slideBack(){
    this.slidesSteps.slidePrev();
  }

  slideNext(){
    this.slidesSteps.slideNext();
  }
}
