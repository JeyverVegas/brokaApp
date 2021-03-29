import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-buttons-broka',
  templateUrl: './buttons-broka.component.html',
  styleUrls: ['./buttons-broka.component.scss'],
})
export class ButtonsBrokaComponent implements OnInit {

  @Input() color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'dark' | 'medium' | 'light' = "primary";
  @Input() sizes: 'small' | 'normal' | 'large' = "normal";
  @Input() shadow: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'dark' | 'medium' | 'light' = null;
  @Input() fill: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'dark' | 'medium' | 'light' = null;

  constructor() { }

  ngOnInit() { }

}
