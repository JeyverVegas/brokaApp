import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductosService } from '../servicios/productos.service';

@Component({
  selector: 'app-descartado',
  templateUrl: './descartado.page.html',
  styleUrls: ['./descartado.page.scss'],
})
export class DescartadoPage implements OnInit {

  descartados = [];

  constructor(
    private productosService: ProductosService
  ) { }

  ngOnInit() {
    this.descartados = this.productosService.getDescartados();
  }

}
