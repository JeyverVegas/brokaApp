import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { ProductosService } from '../servicios/productos.service';

@Component({
  selector: 'app-descartado',
  templateUrl: './descartado.page.html',
  styleUrls: ['./descartado.page.scss'],
})
export class DescartadoPage implements OnInit {

  descartados = [];

  constructor(
    private productosService: ProductosService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    //this.descartados = this.productosService.getDescartados();
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
