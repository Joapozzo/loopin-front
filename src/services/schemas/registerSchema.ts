// schemas/registerSchema.ts
import { z } from "zod";

export const step1Schema = z.object({
    nombre: z.string().min(2, "El nombre es requerido"),
    apellido: z.string().min(2, "El apellido es requerido"),
    dni: z.string().min(7, "DNI inválido"),
    celular: z.string().min(10, "Celular inválido"),
    provincia: z.string().min(2, "Provincia requerida"),
    localidad: z.string().min(2, "Localidad requerida"),
    fechaNacimiento: z.string().min(1, "Fecha requerida"),
});

export const step2Schema = z
    .object({
        email: z.string().email("Correo inválido"),
        password: z.string().min(6, "Debe tener al menos 6 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });
