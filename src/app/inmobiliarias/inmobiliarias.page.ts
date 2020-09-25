import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductosService } from '../servicios/productos.service';
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
    private modalCtrl: ModalController

  ) { }

  ngOnInit() {
    this.inmobiliarias = this.productosService.getInmobiliarias();
  }

  async openInmobiliaria(inmobiliaria){
      const modal = await this.modalCtrl.create({
        component: ShowInmobiliariaPage,
        componentProps: {
          inmobiliaria: inmobiliaria
        }
      });

      modal.present();
  }

}
