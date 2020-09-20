import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';

import { ComponentsModule } from '../components/components.module'

import { ChatMensajesPageModule } from '../chat-mensajes/chat-mensajes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    ComponentsModule,
    ChatMensajesPageModule
  ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
