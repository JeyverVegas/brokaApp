import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ErrorAlertComponent } from './error-alert/error-alert.component';

@NgModule({    
    declarations: [TopBarComponent, ErrorAlertComponent],
    exports: [TopBarComponent, CommonModule, ErrorAlertComponent]
})

export class ComponentsModule { }