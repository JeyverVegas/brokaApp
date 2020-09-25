import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescartadoPage } from './descartado.page';

const routes: Routes = [
  {
    path: '',
    component: DescartadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DescartadoPageRoutingModule {}
