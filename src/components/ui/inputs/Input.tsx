import { ReactElement, forwardRef, InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactElement;
    variant?: "default" | "error" | "success" | "outline";
    allowOnlyLetters?: boolean;
    allowOnlyNumbers?: boolean;
    label?: string;
    error?: string;
    helpText?: string;
}

const variantStyles = {
    default: "bg-[var(--violet-50)] focus-within:ring-[var(--violet-200)] border-[var(--violet-200)] hover:border-[var(--violet)] transition-all duration-200",
    error: "bg-[var(--violet-50)] focus-within:ring-red-300 border-red-500",
    success: "bg-[var(--violet-50)] focus-within:ring-green-300 border-green-500",
    outline: "bg-transparent focus-within:ring-[var(--violet-200)] border-[var(--violet-200)] hover:border-white transition-all duration-200",
};

const disabledStyles = {
    default: "bg-gray-100 border-gray-300 cursor-not-allowed",
    error: "bg-gray-100 border-gray-300 cursor-not-allowed",
    success: "bg-gray-100 border-gray-300 cursor-not-allowed",
    outline: "bg-gray-100 border-gray-300 cursor-not-allowed",
};

const labelColorStyles = {
    default: "text-[var(--black)]",
    outline: "text-[var(--violet-100)]",
    disabled: "text-gray-400",
};

const inputTextStyles = {
    default: "text-[var(--violet)] placeholder:text-[var(--violet)] placeholder:opacity-50",
    error: "text-[var(--violet)] placeholder:text-[var(--violet)] placeholder:opacity-50",
    success: "text-[var(--violet)] placeholder:text-[var(--violet)] placeholder:opacity-50",
    outline: "text-white placeholder:text-white placeholder:opacity-50",
    disabled: "text-gray-400 placeholder:text-gray-400 cursor-not-allowed",
};

const iconStyles = {
    default: "text-[var(--violet)]",
    outline: "text-[var(--violet-100)]",
    disabled: "text-gray-400",
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
    name,
    type = "text",
    placeholder = "",
    icon,
    variant = "default",
    className = "",
    allowOnlyLetters = false,
    allowOnlyNumbers = false,
    label,
    error,
    helpText,
    id,
    disabled = false,
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;
    
    // Si hay error, usar variant error automáticamente (pero solo si no está disabled)
    const finalVariant = disabled ? "disabled" : (error ? "error" : variant);
    
    // Auto-detectar labelColor basado en variant y disabled state
    const finalLabelColor = disabled ? "disabled" : (variant === "outline" ? "outline" : "default");
    
    // Determinar estilos del contenedor basado en disabled state
    const containerStyles = disabled ? disabledStyles[variant] : variantStyles[finalVariant === "disabled" ? variant : finalVariant];
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        
        if (allowOnlyLetters && !/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s\b]$/.test(e.key) && e.key.length === 1) {
            e.preventDefault();
        }
        if (allowOnlyNumbers && !/[0-9]/.test(e.key) && e.key.length === 1) {
            e.preventDefault();
        }
        if (props.onKeyDown) props.onKeyDown(e);
    };

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className={`block text-sm font-light mb-2 ${labelColorStyles[finalLabelColor]}`}>
                    {label}
                </label>
            )}
            
            <div className={`flex items-center rounded-md px-3 py-2 w-full 
                ${!disabled ? 'focus-within:ring-2' : ''} border 
                ${containerStyles} 
                ${className}`}>
                {icon && (
                    <div className={`w-5 h-5 mr-2 flex items-center justify-center ${iconStyles[disabled ? 'disabled' : (variant === 'outline' ? 'outline' : 'default')]}`}>
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    name={name}
                    id={inputId}
                    placeholder={placeholder}
                    disabled={disabled}
                    onKeyDown={handleKeyDown}
                    className={`bg-transparent border-none outline-none text-lg font-light placeholder:font-normal w-full ${inputTextStyles[disabled ? 'disabled' : finalVariant]} input-${variant}`}
                    {...props}
                />
            </div>
            
            {error && !disabled && (
                <p className="mt-1 text-sm text-red-300">{error}</p>
            )}
            {helpText && !error && (
                <p className={`mt-1 text-sm ${disabled ? 'text-gray-400' : (variant === 'outline' ? 'text-[var(--violet-200)]' : 'text-gray-500')}`}>{helpText}</p>
            )}
        </div>
    );
});

Input.displayName = "Input";
export default Input;