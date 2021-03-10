import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FiltrosPage } from 'src/app/filtros/filtros.page';
import { Filtros2Page } from 'src/app/filtros2/filtros2.page';
import { ProductosService } from 'src/app/servicios/productos.service';
import { SmartAudioService } from 'src/app/servicios/smart-audio.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {

  @Input() titulo: string;
  @Input() back: string;

  constructor(
    private modalCtrl: ModalController,
    private smartAudio: SmartAudioService,
    private navCtrl: NavController,
    private productosService: ProductosService
  ) { }

  ngOnInit() {
  }

  async abriFiltros() {
    this.playSound();
    const modal = await this.modalCtrl.create({
      component: Filtros2Page,
    });

    modal.present();
  }

  goBack() {
    this.navCtrl.back();
  }

  playSound() {
    this.smartAudio.play('tabSwitch');
  }

}
