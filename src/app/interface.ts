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

export interface State {
    id?: number;
    name?: string;
}


export interface City extends State { }
export interface PropertyType extends State { }
export interface ContractType extends State { }
export interface PropertyStatus extends State { }
export interface PropertyFeatures extends State { }

export interface ProductFilters {
    name?: string;
    type?: Array<number>;
    contractType?: Array<number>;
    sizeBetween?: [number, number];
    roomsBetween?: [number, number];
    bathroomsBetween?: [number, number];
    status?: Array<number>;
    hasAnyFeatures?: Array<number>;
    realEstateAgency?: Array<number>;
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

