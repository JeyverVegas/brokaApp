import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ErrorAlertComponent } from './error-alert/error-alert.component';
import { SelectMultipleComponent } from './select-multiple/select-multiple.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { SelectAddressComponent } from './select-address/select-address.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule],
    declarations: [TopBarComponent, ErrorAlertComponent, SelectMultipleComponent, GoogleMapComponent, SelectAddressComponent],
    exports: [TopBarComponent, ErrorAlertComponent, SelectMultipleComponent, GoogleMapComponent, SelectAddressComponent, CommonModule, FormsModule, IonicModule]
})

export class ComponentsModule { }