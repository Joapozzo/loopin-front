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