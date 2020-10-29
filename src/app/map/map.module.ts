import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { ComponentsModule } from '../components/components.module';
import { ShowProductPageModule } from '../show-product/show-product.module';
import { FiltrosPageModule } from '../filtros/filtros.module';
import { MapOptionsPageModule } from '../map-options/map-options.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    ComponentsModule,
    ShowProductPageModule,
    FiltrosPageModule,
    MapOptionsPageModule
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
