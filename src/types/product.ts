export interface Product {
    pro_id: number;
    suc_id: number;
    neg_id: number;
    pro_nom: string;
    pro_puntos_canje: number;
    pro_cantidad_disp: number;
    pro_url_foto: string;
    pro_activo: number;
    suc_nom: string;
    pro_tip_nom: string;
    cat_tip_nom: string;
    public_url: string;
    pro_tyc?: string;
}

export interface ProductoFormData {
    pro_nom: string;
    pro_puntos_canje: number;
    pro_cantidad_disp: number;
    cat_tip_id: number;
    pro_tip_id: number;
    pro_activo: boolean; 
    pro_tyc: string;
}

export interface ProductoEndpoints {
    getAll: string;
    getSucursal: string;
    getById: string;
    create: string;
    update: string;
    delete: string;
    updatePhoto?: string;
}

export interface ProductoApiResponse {
    productos: Product[];
    mensaje: string;
}

// Props para tarjeta de producto
export interface ProductoCardProps {
    producto: Product;
    onSelect: (producto: Product) => void;
    isSelected?: boolean;
}

// Filtros para productos
export interface ProductoFilters {
    search: string;
    categoria?: string;
}

export interface ProductoGridProps {
    productos: Product[];
    onSelectProducto: (producto: Product) => void;
    selectedProducto?: Product | null;
    filters: ProductoFilters;
    onFiltersChange: (filters: ProductoFilters) => void;
    isLoading?: boolean;
}

export interface TipoProducto {
    pro_tip_id: number;
    pro_tip_nom: string;
    pro_tip_desc: string | null;
}

export interface TipoProductoApiResponse {
    tipo_productos: TipoProducto[];
    mensaje: string;
}