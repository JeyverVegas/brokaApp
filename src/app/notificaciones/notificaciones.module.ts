import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificacionesPageRoutingModule } from './notificaciones-routing.module';

import { NotificacionesPage } from './notificaciones.page';
import { ComponentsModule } from '../components/components.module';
import { PropertyCardPageModule } from '../property-card/property-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificacionesPageRoutingModule,
    ComponentsModule,
    PropertyCardPageModule
  ],
  declarations: [NotificacionesPage]
})
export class NotificacionesPageModule { }
