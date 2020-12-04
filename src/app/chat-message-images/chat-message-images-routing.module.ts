import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatMessageImagesPage } from './chat-message-images.page';

const routes: Routes = [
  {
    path: '',
    component: ChatMessageImagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatMessageImagesPageRoutingModule {}
