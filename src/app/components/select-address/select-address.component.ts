import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { City, State, Color } from 'src/app/interface';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.scss'],
})
export class SelectAddressComponent implements OnInit, OnChanges {

  @Input() items: any = [];

  @Input() color: Color = 'primary';

  @Input() shape: 'round' | 'normal' = 'normal';

  @Input() class: string = '';

  @Input() for: 'states' | 'cities' = 'states';

  @Input() searchPlaceHolder: string = 'Buscar';

  @Input() mode: 'md' | 'ios' = null;

  @Input() label: string = 'Select Address Component';
  @Input() closeIcon: string = 'chevron-up-outline';


  @Input() selectAllText: string = 'Seleccionar todos';
  @Input() showSelectAll: boolean = false;
  allSelected: boolean = false;

  filteredItems: any = [];
  selectedItems: any = [];

  @Input() defaultValues: number[];

  @Output() onChange = new EventEmitter<State[] | City[]>();

  @Output() onSearch = new EventEmitter<string>();
  loadingAddress = false;

  @Output() onSelectedItem = new EventEmitter<City | State>();
  @Output() onDeSelectedItem = new EventEmitter<City | State>();


  constructor() { }

  ngOnInit() {
    this.loadingAddress = false;
  }

  ngOnChanges(changes) {
    if (changes.items) {
      this.loadingAddress = false;
    }
  }

  filtrar(ev) {
    this.loadingAddress = true;

    const valor: string = ev.target.value;


    this.onSearch.emit(valor);


    /* if (!valor) {
      return;
    }

    const filterCb = address => {
      if (address.name && valor) {
        return (address.name.toLowerCase().indexOf(valor.toLowerCase()) > -1 || address.state.name.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      }
    };

    if (this.for == 'states') {
      this.filteredItems = this.filteredItems.filter(filterCb);
      return;
    }

    this.filteredItems = this.filteredItems.map(item => ({
      ...item,
      cities: item.cities.filter(filterCb),
    }))
    console.log(this.filteredItems) */
  }

  getSelectedItemsId(addressId) {
    return this.selectedItems.map(item => item.id).includes(addressId);
  }

  toggleAddress(address: City | State) {
    let remove: boolean = false;
    for (let [index, a] of this.selectedItems.entries()) {
      if (a.id === address.id) {
        this.selectedItems.splice(index, 1);
        remove = true;
        this.onDeSelectedItem.emit(address);
        break;
      }
    }

    if (!remove) {
      this.selectedItems[0] = address;
      /* this.selectedItems.push(address); */
      this.onSelectedItem.emit(address);
    }

    /* if (this.for === 'states') {
      this.allSelected = this.selectedItems.length === this.items.length;
    } else {
      let sum = 0;

      this.items.forEach((item: any) => {
        sum = sum + item.cities.length;
      });

      this.allSelected = this.selectedItems.length === sum;
    } */

    this.onChange.emit(this.selectedItems);
  }

  selectAll(event) {
    let selectedAll: boolean = event.target.checked;
    if (this.for == 'states') {
      if (selectedAll) {
        this.selectedItems = []
      } else {
        this.selectedItems = [...this.items];
      }
    } else {

    }
    //console.log(this.items);
  }

  onAllSelectedChange(event) {

    if (event.target.checked) {
      return this.selectedItems = [];
    }

    if (this.for == 'states') {
      this.selectedItems = [...this.items];
    } else {
      this.items.forEach((state: any) => {
        this.selectedItems.push(...state.cities)
      })
    }

    this.onChange.emit(this.selectedItems);
  }
}
