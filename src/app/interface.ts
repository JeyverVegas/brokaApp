export interface Usuario {
    email?: string;
    created_at?: Date;
    updated_at?: Date;
    profile?: Profile; //opcional pero no puede matchear.
    address?: UserAddress; //opcional pero no puede matchear.    
}

export interface Profile {
    firstname?: string;
    lastname?: string;
    bio?: string; //opcional
    image?: string;
    phone?: string; //opcional
    profile_images?: [ProfileImage]; //opcinal
    created_at?: Date;
    updated_at?: Date;
}

export interface UserAddress{
    id?: number;
    state?: State;
    city?: City,
    address?: string;
    latitude?: number;
    longitude?: number; 
}

export interface ProfileImage{
    id?: number;
    url?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface State{
    id?: number;
    name?: string;    
} 


export interface City extends State{}