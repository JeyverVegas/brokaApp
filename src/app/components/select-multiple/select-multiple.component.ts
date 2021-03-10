import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { selectMultipleErrors } from 'src/app/interface';

@Component({
  selector: 'app-select-multiple',
  templateUrl: './select-multiple.component.html',
  styleUrls: ['./select-multiple.component.scss'],
})
export class SelectMultipleComponent implements OnInit {

  @Input() numberOptions: number;
  @Input() multiple: boolean = false;
  @Input() values: number[] = [];
  @Input() color: string = "primary";
  @Input() size: string = "normal";

  error: selectMultipleErrors = {};
  selectOptions = [];

  @Output() change = new EventEmitter<number[]>();
  constructor() { }

  ngOnInit() {
    if (!this.numberOptions) {
      this.error.message = 'la propiedad numberOptions no puede estar vacia.';
      this.error.error = true;
    }
    this.selectOptions = Array.from(Array(+this.numberOptions));
  }

  toggleValues(value) {
    const valueExist = this.values.includes(Number(value));
    if (valueExist) {
      this.values = this.values.filter(n => n !== Number(value))
    } else {
      this.values = [Number(value), ...this.values];
    }

    this.change.emit(this.values);
  }









}
