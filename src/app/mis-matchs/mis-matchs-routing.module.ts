import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisMatchsPage } from './mis-matchs.page';

const routes: Routes = [
  {
    path: '',
    component: MisMatchsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisMatchsPageRoutingModule {}
