import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisBusquedasPage } from './mis-busquedas.page';

const routes: Routes = [
  {
    path: '',
    component: MisBusquedasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisBusquedasPageRoutingModule {}
