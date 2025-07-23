// contexts/RegisterContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { z } from 'zod';

// Schema para Step 1 (Email y contraseña)
export const step1Schema = z
    .object({
        email: z.string().email("Ingresa un email válido"),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
        confirmPassword: z.string().min(6, "Confirma tu contraseña"),
        firebaseUID: z.string().optional(), // Se añade después de crear la cuenta
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

// Schema para Step 2 (Datos personales)
export const step2Schema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    dni: z.string().min(7, "El DNI debe tener al menos 7 dígitos").max(8, "El DNI no puede tener más de 8 dígitos"),
    celular: z.string().min(10, "El celular debe tener al menos 10 dígitos"),
    provincia: z.number().min(1, "Selecciona una provincia"),
    localidad: z.number().min(1, "Selecciona una localidad"),
    fechaNacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
});

// Types
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type RegisterData = Partial<Step1Data & Step2Data>;

interface RegisterContextType {
    data: RegisterData;
    updateStep1Data: (data: Partial<Step1Data>) => void;
    updateStep2Data: (data: Step2Data) => void;
    clearData: () => void;
    isStep1Complete: boolean;
    isStep2Complete: boolean;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export function RegisterProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<RegisterData>({});

    const updateStep1Data = (step1Data: Partial<Step1Data>) => {
        setData(prev => ({ ...prev, ...step1Data }));
    };

    const updateStep2Data = (step2Data: Step2Data) => {
        setData(prev => ({ ...prev, ...step2Data }));
    };

    const clearData = () => {
        setData({});
    };

    // Verifica que los campos esenciales del Step 1 estén completos
    const isStep1Complete = Boolean(
        data.email &&
        data.password &&
        data.firebaseUID
    );

    // Verifica que todos los campos del Step 2 estén completos
    const isStep2Complete = Boolean(
        data.nombre &&
        data.apellido &&
        data.dni &&
        data.celular &&
        data.provincia &&
        data.localidad &&
        data.fechaNacimiento
    );

    return (
        <RegisterContext.Provider
            value={{
                data,
                updateStep1Data,
                updateStep2Data,
                clearData,
                isStep1Complete,
                isStep2Complete,
            }}
        >
            {children}
        </RegisterContext.Provider>
    );
}

export function useRegister() {
    const context = useContext(RegisterContext);
    if (!context) {
        throw new Error('useRegister must be used within a RegisterProvider');
    }
    return context;
}