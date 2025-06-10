import { Cliente } from "@/types/cliente";
import { User } from "@/types/user";

export interface ClienteCompleto extends Cliente, User { }

export interface ClienteFormData {
    cli_nom: string;
    cli_ape: string;
    cli_fecha_nac: string;
    usu_mail: string;
    usu_cel: string;
    usu_dni: string;
    usu_loc_id: number;
    tip_id: number;
}

export interface ClienteEndpoints {
    getAll: string;
    getById: string;
    create: string;
    update: string;
    delete: string;
}