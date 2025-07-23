export interface Sucursal {
    suc_id: number;
    neg_id: number;
    suc_nom: string;
    suc_dir: string;
    suc_cel: string;
    suc_url_foto: string;
    suc_relacion_puntos?: number;
    suc_color?: string;
    suc_activo?: number;
    suc_fecha_alta?: string;
    suc_fecha_baja?: string | null;
    suc_prefix?: string;
}

export interface Negocio {
    neg_id: number;
    neg_nom: string;
    neg_url_foto: string;
    neg_color: string;
    neg_fecha_alta: string;
    neg_fecha_baja: string | null;
    neg_activo: number;
}

export interface ComercioEncargadoResponse {
    sucursal: Sucursal;
    mensaje: string;
}