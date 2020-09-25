import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescartadoPageRoutingModule } from './descartado-routing.module';

import { DescartadoPage } from './descartado.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DescartadoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DescartadoPage]
})
export class DescartadoPageModule {}
