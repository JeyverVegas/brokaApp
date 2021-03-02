import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ErrorAlertComponent } from './error-alert/error-alert.component';
import { SelectMultipleComponent } from './select-multiple/select-multiple.component';

@NgModule({
    declarations: [TopBarComponent, ErrorAlertComponent, SelectMultipleComponent],
    exports: [TopBarComponent, CommonModule, ErrorAlertComponent, SelectMultipleComponent]
})

export class ComponentsModule { }