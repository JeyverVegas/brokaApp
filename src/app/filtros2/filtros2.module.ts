import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Filtros2PageRoutingModule } from './filtros2-routing.module';

import { Filtros2Page } from './filtros2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Filtros2PageRoutingModule
  ],
  declarations: [Filtros2Page]
})
export class Filtros2PageModule {}
