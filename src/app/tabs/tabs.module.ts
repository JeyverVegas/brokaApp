import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { FiltrosPageModule } from '../filtros/filtros.module';
import { ShowProductPageModule } from '../show-product/show-product.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    FiltrosPageModule,
    ShowProductPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
