import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.scss'],
})
export class ErrorAlertComponent implements OnInit {

  @Input() error: any;  

  constructor() { }

  ngOnInit() {
    console.log(this.error);
  }

  public get errorList() {
    return Object.entries(this.error.errors)
      .reduce((acum, [_, value]) => acum.concat(value), []);
  }

}
