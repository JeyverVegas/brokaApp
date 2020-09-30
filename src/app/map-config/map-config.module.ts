import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapConfigPageRoutingModule } from './map-config-routing.module';

import { MapConfigPage } from './map-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapConfigPageRoutingModule
  ],
  declarations: [MapConfigPage]
})
export class MapConfigPageModule {}
