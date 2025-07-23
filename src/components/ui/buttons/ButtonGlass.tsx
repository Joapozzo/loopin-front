import React from 'react';

interface GlassmorphismButtonProps {
    icon?: React.ReactNode | string;
    label: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const GlassmorphismButton: React.FC<GlassmorphismButtonProps> = ({
    icon = '+',
    label,
    onClick,
    className = '',
    disabled = false,
    size = 'md',
    variant = 'default'
}) => {
    const sizeClasses = {
        sm: 'p-2',
        md: 'p-3',
        lg: 'p-4'
    };

    const variantClasses = {
        default: 'bg-white/10 border-white/10 text-white hover:bg-white/20',
        success: 'bg-green-500/20 border-green-300/20 text-green-100 hover:bg-green-500/30',
        warning: 'bg-orange-500/20 border-orange-300/20 text-orange-100 hover:bg-orange-500/30',
        danger: 'bg-red-500/20 border-red-300/20 text-red-100 hover:bg-red-500/30',
        info: 'bg-blue-500/20 border-blue-300/20 text-blue-100 hover:bg-blue-500/30'
    };

    const iconSizeClasses = {
        sm: 'text-xs',
        md: 'text-xs',
        lg: 'text-sm'
    };

    const labelSizeClasses = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-xl'
    };

    return (
        <div
            onClick={disabled ? undefined : onClick}
            className={`
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                rounded-lg backdrop-blur-sm border cursor-pointer
                transition-all duration-200 scale-100 hover:scale-105
                ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
                ${className}
            `}
        >
            <div className={`${iconSizeClasses[size]} opacity-80`}>
                {icon}
            </div>
            <div className={`${labelSizeClasses[size]} font-bold`}>
                {label}
            </div>
        </div>
    );
};