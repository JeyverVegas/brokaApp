import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private productos = [
    {
      id: 1,
      nombre: 'Fit Roiz 1350',
      categoria: {
        id: 2,
        nombre: 'Apartamentos'
      },
      provincy: 'Buenos Aires',
      partido: 'Rosario',
      address: 'Calle Rossini 9',
      latLng: {
        lat: -34.609129, 
        lng: -58.426284
      },
      imagenes: [
        "../../assets/images/inmuebles/inmueble1/1.jpg",
        "../../assets/images/inmuebles/inmueble1/2.jpg",
        "../../assets/images/inmuebles/inmueble1/3.jpg",
        "../../assets/images/inmuebles/inmueble1/4.jpg",
        "../../assets/images/inmuebles/inmueble1/5.jpg",
      ],
      precio: 1000,
      m2: 40,
      habitaciones: 3,
      banos: 2,
      tipoDeContrato: {
        id: 2,
        nombre: 'Venta'
      },
      tipoDeVivienda: {
        id: 2,
        nombre: 'Casas o chalets'
      },
      estado: {
        id: 2,
        nombre: 'Buen estado'
      },
      tipoAnuncio: {
        id: 2,
        nombre: 'De bancos',
      },
      planta: {
        id: 1,
        nombre: 'última planta',
      },
      descripcion: 'Lindo Apartamento, comodo para 6 personas.',
      caracteristicas: [
        {
          id: 1,
          titulo: 'Ascensor',
        },
        {
          id: 2,
          titulo: 'Plaza de garaje',
        },
        {
          id: 3,
          titulo: 'Piscina',
        },
        {
          id: 4,
          titulo: 'Terraza',
        },
        {
          id: 5,
          titulo: 'Exterior',
        },
      ]
    },
    {
      id: 2,
      nombre: 'Casa #1',
      categoria: {
        id: 1,
        nombre: 'Viviendas'
      },
      provincy: 'Córdoba',
      partido: 'Gral. San Martín',
      address: 'Calle #9, Casa #3.',
      latLng: {
        lat: -34.595194,  
        lng: -58.389484
      },
      imagenes: [
        "../../assets/images/inmuebles/inmueble2/1.jpg",
      ],
      precio: 600,
      m2: 80,
      habitaciones: 5,
      banos: 3,
      tipoDeContrato: {
        id: 2,
        nombre: 'Venta'
      },
      tipoDeVivienda: {
        id: 2,
        nombre: 'Casas o chalets'
      },
      estado: {
        id: 2,
        nombre: 'Buen estado'
      },
      tipoAnuncio: {
        id: 2,
        nombre: 'De bancos',
      },
      descripcion: 'Casa de lujo Ubicada en la zona alta de buenos aires, con parqueadero de autos, piscina.',
      caracteristicas: [
        {
          id: 2,
          titulo: 'Plaza de garaje',
        },
        {
          id: 3,
          titulo: 'Piscina',
        },
        {
          id: 6,
          titulo: 'Trastero',
          filtrar: false
        },
        {
          id: 7,
          titulo: 'Aire Acondicionado',
          filtrar: false
        },
        {
          id: 8,
          titulo: 'Armarios empotrados',
          filtrar: false
        },
        {
          id: 5,
          titulo: 'Exterior',
        },
      ]
    },
    {
      id: 3,
      nombre: 'Casa #2',
      categoria: {
        id: 1,
        nombre: 'Viviendas'
      },
      provincy: 'Buenos Aires',
      partido: 'EZEIZA',
      address: 'Av. Bolivar, Casa #4',
      latLng: {
        lat: -34.608405,  
        lng: -58.437978
      },
      imagenes: [
        "../../assets/images/inmuebles/inmueble3/1.jpg",
      ],
      precio: 3000,
      m2: 80,
      habitaciones: 2,
      banos: 2,
      tipoDeContrato: {
        id: 1,
        titulo: 'Alquilar'
      },
      tipoDeVivienda: {
        id: 2,
        nombre: 'Casas o chalets'
      },
      estado: {
        id: 2,
        nombre: 'Buen estado'
      },
      tipoAnuncio: {
        id: 2,
        nombre: 'De bancos',
      },
      descripcion: 'Casa de lujo Ubicada en la zona alta de palermo, con parqueadero de autos, piscina.',
      caracteristicas: [
        {
          id: 2,
          titulo: 'Plaza de garaje',
        },
        {
          id: 3,
          titulo: 'Piscina',
        },
        {
          id: 6,
          titulo: 'Trastero',
          filtrar: false
        },
        {
          id: 7,
          titulo: 'Aire Acondicionado',
          filtrar: false
        },
        {
          id: 8,
          titulo: 'Armarios empotrados',
          filtrar: false
        },
        {
          id: 5,
          titulo: 'Exterior',
        },
      ]
    },
    {
      id: 4,
      nombre: 'Local #1',
      categoria: {
        value: 4,
        nombre: 'Locales'
      },
      provincy: 'Córdoba',
      partido: 'Gral. Roca',
      address: 'Calle #5, C.C. "Alto Palermo".',
      latLng: {
        lat: -34.594487,
        lng: -58.432593
      },
      imagenes: [
        "../../assets/images/inmuebles/inmueble4/1.jpg",
        "../../assets/images/inmuebles/inmueble4/2.jpg",
        "../../assets/images/inmuebles/inmueble4/3.jpg",
      ],
      precio: 6000,
      m2: 60,
      tipoDeContrato: {
        id: 1,
        titulo: 'Alquilar'
      },
      estado: {
        id: 2,
        nombre: 'Buen estado'
      },
      tipoAnuncio: {
        id: 2,
        nombre: 'De bancos',
      },
      descripcion: 'Local grande, ubicado en el C.C. Metropolis.',
      caracteristicas: [
        {
          id: 7,
          titulo: 'Aire Acondicionado',
          filtrar: false
        },
        {
          id: 8,
          titulo: 'Armarios empotrados',
          filtrar: false
        },
      ]
    },
    
  ];

  filtros = {
    mostrarTodo: true,
    categoria: '1',    
    precios: {
      lower: this.getMaxAndMin().minPrecio,
      upper: this.getMaxAndMin().maxPrecio
    },

    m2: {
      lower: this.getMaxAndMin().minM2,
      upper: this.getMaxAndMin().maxM2
    },

    habitaciones: {
      lower: this.getMaxAndMin().minHabitaciones,
      upper: this.getMaxAndMin().maxHabitaciones
    },
    banos: {
      lower: this.getMaxAndMin().minBanos,
      upper: this.getMaxAndMin().maxBanos
    },
    tipoDeContrato: [
      {
        id: 1,
        titulo: 'Alquilar',
        filtrar: false
      },
      {
        id: 2,
        titulo: 'Venta',
        filtrar: false
      },
      {
        id: 3,
        titulo: 'Compartir',
        filtrar: false
      },
      {
        id: 4,
        titulo: 'Vacacional',
        filtrar: false
      },
      {
        id: 5,
        titulo: 'Traspaso',
        filtrar: false
      },
      {
        id: 6,
        titulo: 'Ópcion a compra',
        filtrar: false
      },
    ],
    tipoDeVivienda: [
      {
        id: 1,
        titulo: 'Pisos',
        filtrar: false
      },
      {
        id: 2,
        titulo: 'Casas o chalets',
        filtrar: false
      },
      {
        id: 3,
        titulo: 'Casas rústicas',
        filtrar: false
      },
      {
        id: 4,
        titulo: 'Dúplex',
        filtrar: false
      },
      {
        id: 5,
        titulo: 'Ático',
        filtrar: false
      },
    ],
    estados: [
      {
        id: 1,
        titulo: 'Obra nueva',
        filtrar: false
      },
      {
        id: 2,
        titulo: 'Buen estado',
        filtrar: false
      },
      {
        id: 3,
        titulo: 'A reformar',
        filtrar: false
      },
    ],
    caracteristicas: [
      {  
        id: 1,      
        titulo: 'Ascensor',
        filtrar: false
      },
      {
        id: 2,
        titulo: 'Plaza de garaje',
        filtrar: false
      },
      {
        id: 3,
        titulo: 'Piscina',
        filtrar: false
      },
      {
        id: 4,
        titulo: 'Terraza',
        filtrar: false
      },
      {
        id: 5,
        titulo: 'Exterior',
        filtrar: false
      },
      {
        id: 6,
        titulo: 'Trastero',
        filtrar: false
      },
      {
        id: 7,
        titulo: 'Aire Acondicionado',
        filtrar: false
      },
      {
        id: 8,
        titulo: 'Armarios empotrados',
        filtrar: false
      },
      {
        id: 9,
        titulo: 'Jardín',
        filtrar: false
      },
    ],
    tipoAnuncio: [
      {
        id: 1,
        titulo: 'Con visita virtual',
        filtrar: false
      },
      {
        id: 2,
        titulo: 'De bancos',
        filtrar: false
      }
    ],
    planta: [
      {
        id: 1,
        titulo: 'última planta',
        filtrar: false
      },
      {
        id: 2,
        titulo: 'Plantas intermedias',
        filtrar: false
      },
      {
        id: 3,
        titulo: 'Bajos',
        filtrar: false
      }
    ]
  }  

  constructor() { }

  getMaxAndMin() {
    return {
      maxPrecio: Math.max.apply(Math, this.productos.map(function (o) { if (typeof o.precio !== 'undefined') { return o.precio; } else { return false } })),
      minPrecio: Math.min.apply(Math, this.productos.map(function (o) { if (typeof o.precio !== 'undefined') { return o.precio; } else { return false } })),

      maxM2: Math.max.apply(Math, this.productos.map(function (o) { if (typeof o.m2 !== 'undefined') { return o.m2; } else { return false } })),
      minM2: Math.min.apply(Math, this.productos.map(function (o) { if (typeof o.m2 !== 'undefined') { return o.m2; } else { return false } })),

      maxHabitaciones: Math.max.apply(Math, this.productos.map(function (o) { if (typeof o.habitaciones !== 'undefined') { return o.habitaciones; } else { return false } })),
      minHabitaciones: Math.min.apply(Math, this.productos.map(function (o) { if (typeof o.habitaciones !== 'undefined') { return o.habitaciones; } else { return false } })),

      maxBanos: Math.max.apply(Math, this.productos.map(function (o) { if (typeof o.banos !== 'undefined') { return o.banos; } else { return false } })),
      minBanos: Math.min.apply(Math, this.productos.map(function (o) { if (typeof o.banos !== 'undefined') { return o.banos; } else { return false } })),
    }
  }

  addFiltros(filtros){
    Object.assign(this.filtros, filtros);
    if(!this.filtros.mostrarTodo){
      console.log('estoy filtrando.');      
    }else{
      console.log('no estoy filtrando.');
    }
  }

  getFiltros() {
    return this.filtros;
  }

  getProducts() {    
      return this.productos;    
  }
}
