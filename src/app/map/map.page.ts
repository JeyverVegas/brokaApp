import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ProductosService } from '../servicios/productos.service';

declare var google: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  productos = [];
  @ViewChild('googlemap', { static: true }) protected googlemap: ElementRef;
  constructor(
    private productoService: ProductosService,
    private navCtrl: NavController    
  ) { }

  ngOnInit() {
    this.productos = this.productoService.getProducts();
    this.crearMapa();

    this.productos.forEach(producto =>{
      console.log(producto.nombre.length);
    })
  }


  crearMapa() {
    var map = new google.maps.Map(this.googlemap.nativeElement, {
      center: this.productos[0].latLng, 
      zoom: 10,      
      mapTypeControl: false,
      zoomControl: false,
      scaleControl: false,
      streetViewControl: false,      
      fullscreenControl: false
    });

    this.productos.forEach(producto =>{      
      var labelOrigin = new google.maps.Point(80, 15);
      if(producto.nombre.length > 12){
        labelOrigin = new google.maps.Point(95, 15);
      }

      var marker = new google.maps.Marker({
        position: producto.latLng,
        map: map,      
        title: 'hola',
        label: {        
          color: "#222428",
          fontSize: "14px",
          fontWeight: 'bold',
          text: producto.nombre
        },
        icon: {
          url: producto.imagenes[0],          
          labelOrigin: labelOrigin,
          scaledSize: new google.maps.Size(50, 50)
        }
      });  
    })
    
  }

  goBack(){
    this.navCtrl.back();
  }
}
