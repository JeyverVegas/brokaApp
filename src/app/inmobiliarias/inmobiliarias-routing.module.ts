import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InmobiliariasPage } from './inmobiliarias.page';

const routes: Routes = [
  {
    path: '',
    component: InmobiliariasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InmobiliariasPageRoutingModule {}
