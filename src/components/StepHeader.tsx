import React from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import Image from "next/image";

interface StepHeaderProps {
    title: string;
    subtitle?: string;
    currentStep: number;
    totalSteps: number;
    logo?: string;
}

export function StepHeader({ 
    title, 
    subtitle, 
    currentStep, 
    totalSteps,
    logo = "/logos/logo.svg"
}: StepHeaderProps) {
    return (
        <div className="text-center mb-6">
            <div className="mb-3">
                <Image src={logo} alt="Logo Loopin" className="h-8 w-auto mx-auto" width={120} height={40} />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--violet)] mb-2">Unite a Loopin</h2>
            <p className="text-base text-gray-600 mb-4">
                {subtitle || "Completá tus datos para registrarte"}
            </p>
            
            <ProgressIndicator 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
                className="mb-4"
            />
            
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                <p className="text-sm text-gray-500">Paso {currentStep} de {totalSteps}</p>
            </div>
        </div>
    );
}