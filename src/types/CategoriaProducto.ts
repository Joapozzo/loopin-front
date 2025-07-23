
export interface CategoriaProducto {
    cat_tip_id: number;
    cat_tip_nom: string;
    cat_tip_desc: string | null;
}

export interface CategoriaApiResponse {
    categorias_productos: CategoriaProducto[];
    mensaje?: string;
}

export interface CategoriaApiResponseLegacy {
    categorias: CategoriaProducto[];
    mensaje?: string;
}