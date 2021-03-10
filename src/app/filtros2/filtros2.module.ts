import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Filtros2PageRoutingModule } from './filtros2-routing.module';

import { Filtros2Page } from './filtros2.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Filtros2PageRoutingModule,
    ComponentsModule
  ],
  declarations: [Filtros2Page]
})
export class Filtros2PageModule { }
