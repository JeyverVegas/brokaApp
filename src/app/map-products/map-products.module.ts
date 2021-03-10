import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapProductsPageRoutingModule } from './map-products-routing.module';

import { MapProductsPage } from './map-products.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapProductsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MapProductsPage]
})
export class MapProductsPageModule { }
