import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InmobiliariasPageRoutingModule } from './inmobiliarias-routing.module';

import { InmobiliariasPage } from './inmobiliarias.page';
import { ComponentsModule } from '../components/components.module';
import { ShowInmobiliariaPageModule } from '../show-inmobiliaria/show-inmobiliaria.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InmobiliariasPageRoutingModule,
    ComponentsModule,
    ShowInmobiliariaPageModule
  ],
  declarations: [InmobiliariasPage]
})
export class InmobiliariasPageModule {}
