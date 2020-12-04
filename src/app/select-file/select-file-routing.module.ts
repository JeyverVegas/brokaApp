import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectFilePage } from './select-file.page';

const routes: Routes = [
  {
    path: '',
    component: SelectFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectFilePageRoutingModule {}
