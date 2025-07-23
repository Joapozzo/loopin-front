export interface Provincia {
    pro_id: number;
    pro_nom: string;
}

export interface Localidad {
    loc_id: number;
    loc_nom: string;
    pro_id: number;
}

export interface ProvinciasApiResponse {
    provincias: Provincia[];
    mensaje: string;
}

export interface LocalidadesApiResponse {
    localidades: Localidad[];
    mensaje: string;
}