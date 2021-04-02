import { } from 'googlemaps';

export interface selectMultipleErrors {
  message?: string,
  error?: boolean
}

export interface Usuario {
  id?: number;
  email?: string;
  created_at?: Date;
  updated_at?: Date;
  profile?: Profile; //opcional pero no puede matchear.
  address?: UserAddress; //opcional pero no puede matchear.    
}

export interface Profile {
  id?: number;
  firstname?: string;
  lastname?: string;
  bio?: string; //opcional
  image?: string;
  phone?: string; //opcional
  profile_images?: [ProfileImage]; //opcinal
  created_at?: Date;
  updated_at?: Date;
}

export interface UserAddress {
  id?: number;
  state?: State;
  city?: City,
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface ProfileImage {
  id?: number;
  url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type Color = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'dark' | 'medium' | 'light';

export interface State {
  id?: number;
  name?: string;
}


export interface City extends State {
  state_id?: number;
}
export interface PropertyType extends State { }
export interface ContractType extends State { }
export interface PropertyStatus extends State { }
export interface PropertyFeatures extends State { }

export interface LatLng {
  lat: number,
  lng: number
}

export interface ProductFilters {
  name?: string;
  type?: Array<number>;
  per_page?: number;
  contractType?: Array<number>;
  sizeBetween?: [number?, number?];
  rooms?: number[];
  roomsBetween?: [number?, number?];
  bathrooms?: number[];
  bathroomsBetween?: [number?, number?];
  environments?: number[];
  environmentsBetween?: [number?, number?];
  status?: Array<number>;
  hasAnyFeatures?: Array<number>;
  realEstateAgency?: Array<number>;
  radius?: [number, number, number];
  city?: City[];
  state?: State[];
  priceBetween?: [number, number];
  currency?: number;
  within?: LatLng[];
}

export interface googleMapsControlOpts {
  showMyPositionButton?: boolean;
  showRadiusButton?: boolean;
  draggable?: boolean;
  zoom?: number;
}


export type ProductRelationships =
  'type' |
  'contract_type' |
  'status' |
  'features' |
  'images' |
  'prices.currency' |
  'address.state' |
  'address.city' |
  'favorite_to_count' |
  'realEstateAgency' |
  'realEstateAgency.address' |
  'realEstateAgency.address.city' |
  'realEstateAgency.address.state';

export type GetProductsOptions = {
  relationships?: Array<ProductRelationships>;
  filters?: ProductFilters;
}

export interface Match {
  created_at?: string;
  ended_at?: string | null;
  id?: number;
  property?: any;
  property_id: number;
  status?: string;
  updated_at?: string;
  user_id?: number;

}

/* export class BrokaMarkers extends google?.maps?.OverlayView {
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
 */