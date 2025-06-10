export interface User {
    usu_id: number;
    usu_activo: number;
    usu_mail: string;
    usu_cel: string;
    usu_fecha_alta: string;
    usu_fecha_baja: string | null;
    usu_fecha_ultimo_login: string | null;
    usu_login_count: number;
    tip_id: number;
    usu_dni: string;
    usu_loc_id: number;
}