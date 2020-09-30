import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ProductosService } from '../servicios/productos.service';
import { SmartAudioService } from '../servicios/smart-audio.service';

declare var google: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  productos = new BehaviorSubject([]);
  @ViewChild('googlemap', { static: true }) protected googlemap: ElementRef;

  constructor(
    private productoService: ProductosService,
    private navCtrl: NavController,
    private smartAudio: SmartAudioService
  ) { }

  ngOnInit() {
    this.productos = this.productoService.getProducts();
    this.crearMapa();
    
  }


  crearMapa() {
    var map = new google.maps.Map(this.googlemap.nativeElement, {
      center: this.productos.getValue()[0].latLng, 
      zoom: 10,      
      mapTypeControl: false,
      zoomControl: false,
      scaleControl: false,
      streetViewControl: false,      
      fullscreenControl: false
    });

    this.productos.getValue().forEach(producto =>{      
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
    this.playSound();
    this.navCtrl.back();
  }

  playSound(){
    this.smartAudio.play('tabSwitch');
  }
}
