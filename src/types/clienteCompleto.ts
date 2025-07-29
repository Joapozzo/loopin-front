// Estructura real que viene de la API
export interface ClienteCompleto {
    cli_id: number;
    cli_nom: string;
    cli_ape: string;
    cli_fec_nac: string;
    usu_cel: string;
    usu_mail: string;
    usu_dni: string;
    usu_username: string;
}

export interface ClienteFormData {
    cli_nom: string;
    cli_ape: string;
    cli_fec_nac: string;
}

export interface ClienteEndpoints {
    getActivos: string;
    getInactivos: string;
}

export interface ClienteApiResponse {
    clientes: ClienteCompleto[];
    mensaje: string;
}

export interface UserProfile {
    usuario: {
        usu_id: string;
        usu_activo: number;
        usu_username: string;
        usu_mail: string;
        usu_cel: string;
        usu_fecha_alta: string;
        usu_fecha_baja: string;
        usu_fecha_ultimo_login: string;
        usu_login_count: number;
        usu_dni: string;
        usu_loc_id: number;
        tip_id: number;
    };
    mensaje: string;
}