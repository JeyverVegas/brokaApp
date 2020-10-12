import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { ComponentsModule } from '../components/components.module';
import { ShowProductPageModule } from '../show-product/show-product.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    ComponentsModule,
    ShowProductPageModule
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
