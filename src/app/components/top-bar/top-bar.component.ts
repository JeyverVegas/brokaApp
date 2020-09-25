import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiltrosPage } from 'src/app/filtros/filtros.page';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {

  @Input() titulo: string;  

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
        
  }

  async abriFiltros(){
    const modal = await this.modalCtrl.create({
      component: FiltrosPage
    });

    modal.present();
  }

}
