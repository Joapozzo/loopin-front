import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'white' | 'outline' | 'soft' | 'outline-white';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    className = '',
    onClick,
    type = 'button',
    icon: Icon,
    iconPosition = 'left'
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                return 'bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] text-white hover:shadow-2xl hover:scale-105';

            case 'secondary':
                return 'border-2 border-[var(--violet)] text-[var(--violet)] bg-transparent hover:bg-gradient-to-r hover:from-[var(--violet)] hover:to-[var(--rose)] hover:text-white hover:border-transparent';

            case 'white':
                return 'bg-white text-[var(--violet)] hover:bg-gray-100 shadow-xl';

            case 'outline':
                return 'border-2 border-[var(--violet)] text-[var(--violet)] bg-transparent hover:bg-[var(--violet-50)]';

            case 'outline-white':
                return 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-[var(--violet)]';

            case 'soft':
                return 'bg-[var(--violet-200)] text-white hover:bg-[var(--violet)] hover:scale-105 shadow-lg';

            default:
                return 'bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] text-white hover:shadow-2xl hover:scale-105';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-6 py-2 text-sm';
            case 'md':
                return 'px-8 py-3 text-base';
            case 'lg':
                return 'px-10 py-5 text-lg';
            default:
                return 'px-8 py-3 text-base';
        }
    };

    const baseClasses = `
        font-semibold 
        rounded-full 
        transition-all 
        duration-300 
        transform 
        inline-flex 
        items-center 
        justify-center 
        gap-2
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
    `;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={baseClasses}
        >
            {Icon && iconPosition === 'left' && <Icon size={size === 'lg' ? 24 : size === 'sm' ? 16 : 20} />}
            {children}
            {Icon && iconPosition === 'right' && <Icon size={size === 'lg' ? 24 : size === 'sm' ? 16 : 20} />}
        </button>
    );
};

export default Button;