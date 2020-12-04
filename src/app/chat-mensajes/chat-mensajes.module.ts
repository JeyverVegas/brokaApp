import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatMensajesPageRoutingModule } from './chat-mensajes-routing.module';

import { ChatMensajesPage } from './chat-mensajes.page';
import { AutosizeModule } from 'ngx-autosize';
import { SelectFilePageModule } from '../select-file/select-file.module';
import { ChatImagesPreviewPageModule } from '../chat-images-preview/chat-images-preview.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatMensajesPageRoutingModule,
    AutosizeModule,
    SelectFilePageModule,
    ChatImagesPreviewPageModule
  ],
  declarations: [ChatMensajesPage]
})
export class ChatMensajesPageModule {}
