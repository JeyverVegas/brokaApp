import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatMessageImagesPageRoutingModule } from './chat-message-images-routing.module';

import { ChatMessageImagesPage } from './chat-message-images.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatMessageImagesPageRoutingModule
  ],
  declarations: [ChatMessageImagesPage]
})
export class ChatMessageImagesPageModule {}
