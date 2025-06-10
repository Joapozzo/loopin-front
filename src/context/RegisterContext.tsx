// contexts/RegisterContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { z } from 'zod';

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

// Types
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;

export type RegisterData = Partial<Step1Data & Omit<Step2Data, 'confirmPassword'>>;

interface RegisterContextType {
    data: RegisterData;
    updateStep1Data: (data: Step1Data) => void;
    updateStep2Data: (data: Omit<Step2Data, 'confirmPassword'>) => void;
    clearData: () => void;
    isStep1Complete: boolean;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export function RegisterProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<RegisterData>({});

    const updateStep1Data = (step1Data: Step1Data) => {
        setData(prev => ({ ...prev, ...step1Data }));
    };

    const updateStep2Data = (step2Data: Omit<Step2Data, 'confirmPassword'>) => {
        setData(prev => ({ ...prev, ...step2Data }));
    };

    const clearData = () => {
        setData({});
    };

    const isStep1Complete = Boolean(
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
                isStep1Complete
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