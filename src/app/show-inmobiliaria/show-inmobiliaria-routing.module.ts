import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowInmobiliariaPage } from './show-inmobiliaria.page';

const routes: Routes = [
  {
    path: '',
    component: ShowInmobiliariaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowInmobiliariaPageRoutingModule {}
