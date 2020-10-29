import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from '../servicios/authentication.service';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit {

  guardarBusqueda = false;
  name = '';
  canSave = false;
  constructor(
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private productosService: ProductosService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {    
    this.canSave = false;
  }

  tipiando(event){
    let name:string = event.target.value;
    if(name.length > 0){
      this.canSave = true;
    }else{
      this.canSave = false;
    }    
  }

  saveSearch(){
    this.playSound();
    this.authService.saveSearch(this.name, this.productosService.filtros).then(()=>{
        this.guardarBusqueda = true;
    }).catch(err =>{
      console.log(err);
    })
  }

  closeModal(){    
    this.playSound();
    this.modalCtrl.dismiss();
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }


}
