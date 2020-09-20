import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuarioPageRoutingModule } from './usuario-routing.module';

import { UsuarioPage } from './usuario.page';

import { ComponentsModule } from '../components/components.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuarioPageRoutingModule,
    ComponentsModule
  ],
  declarations: [UsuarioPage]
})
export class UsuarioPageModule {}
