import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatImagesPreviewPage } from './chat-images-preview.page';

const routes: Routes = [
  {
    path: '',
    component: ChatImagesPreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatImagesPreviewPageRoutingModule {}
