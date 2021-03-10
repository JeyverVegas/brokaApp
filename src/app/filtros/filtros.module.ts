import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiltrosPageRoutingModule } from './filtros-routing.module';

import { FiltrosPage } from './filtros.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltrosPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [FiltrosPage]
})
export class FiltrosPageModule { }
