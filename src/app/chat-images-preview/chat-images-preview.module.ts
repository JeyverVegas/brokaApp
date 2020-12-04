import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatImagesPreviewPageRoutingModule } from './chat-images-preview-routing.module';

import { ChatImagesPreviewPage } from './chat-images-preview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatImagesPreviewPageRoutingModule
  ],
  declarations: [ChatImagesPreviewPage]
})
export class ChatImagesPreviewPageModule {}
