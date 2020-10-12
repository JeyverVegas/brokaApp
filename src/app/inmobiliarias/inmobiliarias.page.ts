import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';
import { ShowInmobiliariaPage } from '../show-inmobiliaria/show-inmobiliaria.page';

@Component({
  selector: 'app-inmobiliarias',
  templateUrl: './inmobiliarias.page.html',
  styleUrls: ['./inmobiliarias.page.scss'],
})
export class InmobiliariasPage implements OnInit {

  inmobiliarias = [];

  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService
  ) { }

  ngOnInit() {
    //this.inmobiliarias = this.productosService.getInmobiliarias();
  }

  async openInmobiliaria(inmobiliaria){
      this.playSound();
      const modal = await this.modalCtrl.create({
        component: ShowInmobiliariaPage,
        componentProps: {
          inmobiliaria: inmobiliaria
        }
      });

      modal.present();
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
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
