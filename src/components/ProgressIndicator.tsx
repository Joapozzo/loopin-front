import React from "react";

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

export function ProgressIndicator({ 
    currentStep, 
    totalSteps, 
    className = "" 
}: ProgressIndicatorProps) {
    return (
        <div className={`flex justify-center space-x-2 ${className}`}>
            {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber <= currentStep;
                
                return (
                    <div
                        key={stepNumber}
                        className={`w-3 h-3 rounded-full transition-colors ${
                            isActive ? 'bg-[var(--violet)]' : 'bg-gray-300'
                        }`}
                    />
                );
            })}
        </div>
    );
}