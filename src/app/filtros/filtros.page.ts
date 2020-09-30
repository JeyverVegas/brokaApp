import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.page.html',
  styleUrls: ['./filtros.page.scss'],
})
export class FiltrosPage implements OnInit {

  minPrecio = this.productosService.getMaxAndMin().minPrecio;
  maxPrecio = this.productosService.getMaxAndMin().maxPrecio;

  minM2 = this.productosService.getMaxAndMin().minM2;
  maxM2 = this.productosService.getMaxAndMin().maxM2;

  minHabitaciones = this.productosService.getMaxAndMin().minHabitaciones;
  maxHabitaciones = this.productosService.getMaxAndMin().maxHabitaciones;

  minBanos = this.productosService.getMaxAndMin().minBanos;
  maxBanos = this.productosService.getMaxAndMin().maxBanos;

  stepsPrecios = this.maxPrecio * .05;
  stepsM2 = this.maxM2 * .05;

  categorias = [
    {
      value: 1,
      nombre: 'Viviendas'
    },
    {
      value: 2,
      nombre: 'Apartamentos'
    },
    {
      value: 3,
      nombre: 'PenthHouse'
    },
    {
      value: 4,
      nombre: 'Locales'
    },
  ]

   filtros = {};



  customAlertOptions: any = {    
    cssClass: 'hello',    
  };

  constructor(
    private modalCtrl: ModalController,
    private productosService: ProductosService,
    private smartAudio: SmartAudioService
  ) { }  

  ngOnInit() {
    this.filtros = this.productosService.getFiltros();
    console.log(this.filtros);

  }

  async aplicarFiltro() {
    this.playSound();
    this.productosService.addFiltros(this.filtros);
    this.modalCtrl.dismiss();
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }



}
