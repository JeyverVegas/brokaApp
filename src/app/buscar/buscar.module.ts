import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarPageRoutingModule } from './buscar-routing.module';

import { BuscarPage } from './buscar.page';
import { ComponentsModule } from '../components/components.module';
import { Filtros2PageModule } from '../filtros2/filtros2.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarPageRoutingModule,
    ComponentsModule,
    Filtros2PageModule
  ],
  declarations: [BuscarPage]
})
export class BuscarPageModule { }
