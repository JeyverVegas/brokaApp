import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyCardPageRoutingModule } from './property-card-routing.module';

import { PropertyCardPage } from './property-card.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyCardPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PropertyCardPage]
})
export class PropertyCardPageModule { }
