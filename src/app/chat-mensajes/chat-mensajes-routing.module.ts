import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatMensajesPage } from './chat-mensajes.page';

const routes: Routes = [
  {
    path: '',
    component: ChatMensajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatMensajesPageRoutingModule {}
