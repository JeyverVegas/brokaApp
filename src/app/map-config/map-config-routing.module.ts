import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapConfigPage } from './map-config.page';

const routes: Routes = [
  {
    path: '',
    component: MapConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapConfigPageRoutingModule {}
