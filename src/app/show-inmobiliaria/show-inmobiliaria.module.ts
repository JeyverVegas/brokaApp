import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowInmobiliariaPageRoutingModule } from './show-inmobiliaria-routing.module';

import { ShowInmobiliariaPage } from './show-inmobiliaria.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowInmobiliariaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ShowInmobiliariaPage]
})
export class ShowInmobiliariaPageModule {}
