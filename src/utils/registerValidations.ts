// utils/registerValidations.ts
import { z } from "zod";

// Re-exportar los schemas para fácil acceso
export { step1Schema, step2Schema } from "@/context/RegisterContext";

// Utility para validar datos completos
export const completeRegisterSchema = z.object({
    // Step 1 fields
    nombre: z.string().min(2, "El nombre es requerido"),
    apellido: z.string().min(2, "El apellido es requerido"),
    dni: z.string().min(7, "DNI inválido"),
    celular: z.string().min(10, "Celular inválido"),
    provincia: z.string().min(2, "Provincia requerida"),
    localidad: z.string().min(2, "Localidad requerida"),
    fechaNacimiento: z.string().min(1, "Fecha requerida"),
    // Step 2 fields
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "Debe tener al menos 6 caracteres"),
});

export type CompleteRegisterData = z.infer<typeof completeRegisterSchema>;

// Utility para formatear datos para el backend
export function formatRegisterDataForAPI(data: CompleteRegisterData) {
    return {
        ...data,
        fechaNacimiento: new Date(data.fechaNacimiento).toISOString(),
        celular: data.celular.replace(/\s/g, ''), // Remover espacios
        dni: data.dni.replace(/\s/g, ''), // Remover espacios
    };
}

// Utility para validar si todos los datos están completos
export function isRegisterDataComplete(data: any): data is CompleteRegisterData {
    try {
        completeRegisterSchema.parse(data);
        return true;
    } catch {
        return false;
    }
}

// constants/registerSteps.ts
export const REGISTER_STEPS = {
    STEP_1: "/register/step1",
    STEP_2: "/register/step2",
} as const;

export const STEP_NAMES = {
    [REGISTER_STEPS.STEP_1]: "Datos personales",
    [REGISTER_STEPS.STEP_2]: "Configurá tu cuenta",
} as const;

export const STEP_NUMBERS = {
    [REGISTER_STEPS.STEP_1]: 1,
    [REGISTER_STEPS.STEP_2]: 2,
} as const;