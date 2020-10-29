import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisBusquedasPageRoutingModule } from './mis-busquedas-routing.module';

import { MisBusquedasPage } from './mis-busquedas.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisBusquedasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MisBusquedasPage]
})
export class MisBusquedasPageModule {}
