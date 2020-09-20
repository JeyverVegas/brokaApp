import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatMensajesPageRoutingModule } from './chat-mensajes-routing.module';

import { ChatMensajesPage } from './chat-mensajes.page';
import { AutosizeModule } from 'ngx-autosize';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatMensajesPageRoutingModule,
    AutosizeModule
  ],
  declarations: [ChatMensajesPage]
})
export class ChatMensajesPageModule {}
