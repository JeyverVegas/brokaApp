import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectFilePageRoutingModule } from './select-file-routing.module';

import { SelectFilePage } from './select-file.page';
import { ChatMessageImagesPageModule } from '../chat-message-images/chat-message-images.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectFilePageRoutingModule,
    ChatMessageImagesPageModule
  ],
  declarations: [SelectFilePage]
})
export class SelectFilePageModule {}
