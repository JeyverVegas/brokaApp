import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisMatchsPageRoutingModule } from './mis-matchs-routing.module';

import { MisMatchsPage } from './mis-matchs.page';
import { ComponentsModule } from '../components/components.module';
import { ChatMensajesPageModule } from '../chat-mensajes/chat-mensajes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisMatchsPageRoutingModule,
    ComponentsModule,
    ChatMensajesPageModule
  ],
  declarations: [MisMatchsPage]
})
export class MisMatchsPageModule {}
