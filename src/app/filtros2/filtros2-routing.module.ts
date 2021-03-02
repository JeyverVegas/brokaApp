import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Filtros2Page } from './filtros2.page';

const routes: Routes = [
  {
    path: '',
    component: Filtros2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Filtros2PageRoutingModule {}
