export interface Tarjeta {
    tar_id: number;
    res_id: number;
    cli_id: number;
    tar_puntos_disponibles: number;
    tar_fecha_emision: string;
    tar_fecha_baja: string | null;
}
