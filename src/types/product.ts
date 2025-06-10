export interface Product { 
    pro_id: number;
    res_id: number;
    pro_nom: string;
    pro_puntos_canje: number;
    pro_cantidad: number;
    pro_url_foto: string;
    pro_tip_id: number;
}

export interface ProductoFormData {
    pro_nom: string;
    pro_puntos_canje: number;
    pro_cantidad: number;
    pro_url_foto?: string;
    res_id: number;
    pro_tip_id: number;
}

export interface ProductoEndpoints {
    getAll: string;
    getById: string;
    create: string;
    update: string;
    delete: string;
}

export interface ProductoApiResponse {
    productos: Product[];
    mensaje: string;
}