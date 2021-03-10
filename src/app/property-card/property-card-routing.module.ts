import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyCardPage } from './property-card.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyCardPageRoutingModule {}
