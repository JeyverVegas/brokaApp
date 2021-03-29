import { Injectable } from '@angular/core';
import { } from 'googlemaps';
@Injectable({
  providedIn: 'root'
})
export class GoogleMapsApiService {

  googleLoaded: boolean = false

  constructor() {
    this.googleLoaded = this.setGoogleLoaded();
  }


  setGoogleLoaded(): boolean {
    if (!google) {
      console.log('error al cargar google');
      return false;
    } else {
      console.log('todo bien :)');
      return true;
    }
  }


  getBrokaMarker() {
    if (this.googleLoaded) {
      return class BrokaMarkers extends google?.maps?.OverlayView {
        private latlng_: google.maps.LatLng;
        private imageSrc: string;
        private callback: any;
        private user: boolean;
        private div_: HTMLElement | null;

        constructor(latlng: any, imageSrc: string, callback?: any, user?: boolean) {
          super();
          this.latlng_ = latlng;
          this.imageSrc = imageSrc;
          this.callback = callback;
          this.user = user;
          this.div_ = null;
        }

        onAdd() {
          this.div_ = document.createElement('div');
          this.div_.onclick = () => this.callback && this.callback();
          this.div_.className = "animate__animated animate__fadeInDown animate__faster customMarker";
          if (this.user) {
            this.div_.style.zIndex = "99999999999";
          } else {
            this.div_.style.zIndex = "99";
          }

          var img = document.createElement("img");

          img.src = this.imageSrc;
          img.className = "img-iconxD";

          var img2 = document.createElement("img");
          img2.src = "../assets/images/marker2.png";
          img2.className = "img-iconxD2";
          this.div_.appendChild(img);
          this.div_.appendChild(img2);

          const panes = this.getPanes();

          panes.overlayMouseTarget.appendChild(this.div_);

        }

        


        draw() {
          const overlayProjection = this.getProjection();

          var point = overlayProjection.fromLatLngToDivPixel(this.latlng_);

          if (this.div_ && point) {
            this.div_.style.left = point.x + 'px';
            this.div_.style.top = point.y + 'px';
          }

          var me = this;

          google.maps.event.addDomListener(this.div_, "click", function (event) {
            google.maps.event.trigger(me, "click");
          });
        }

        onRemove() {
          if (this.div_) {
            (this.div_.parentNode as HTMLElement).removeChild(this.div_);
            this.div_ = null;
          }
        }
      }
    } else {
      return
    }
  }

}
