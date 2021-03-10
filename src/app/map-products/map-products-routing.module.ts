import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapProductsPage } from './map-products.page';

const routes: Routes = [
  {
    path: '',
    component: MapProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapProductsPageRoutingModule {}
