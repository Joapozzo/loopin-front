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

const labelColorStyles = {
    default: "text-[var(--black)]",
    outline: "text-[var(--violet-100)]",
};

const inputTextStyles = {
    default: "text-[var(--violet)] placeholder:text-[var(--violet-200)]",
    error: "text-[var(--violet)] placeholder:text-[var(--violet-200)]",
    success: "text-[var(--violet)] placeholder:text-[var(--violet-200)]",
    outline: "text-white placeholder:text-[var(--violet-200)]",
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
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;
    
    // Si hay error, usar variant error automáticamente
    const finalVariant = error ? "error" : variant;
    
    // Auto-detectar labelColor basado en variant
    const finalLabelColor = variant === "outline" ? "outline" : "default";
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
                <label htmlFor={inputId} className={`block text-sm font-medium mb-2 ${labelColorStyles[finalLabelColor]}`}>
                    {label}
                </label>
            )}
            
            <div className={`flex items-center rounded-md px-3 py-2 w-full 
                focus-within:ring-2 border 
                ${variantStyles[finalVariant]} 
                ${className}`}>
                {icon && (
                    <div className={`w-5 h-5 mr-2 flex items-center justify-center ${variant === 'outline' ? 'text-[var(--violet-200)]' : 'text-[var(--violet)]'}`}>
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    name={name}
                    id={inputId}
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                    className={`bg-transparent border-none outline-none text-lg font-semibold placeholder:font-normal w-full ${inputTextStyles[finalVariant]}
                        autofill:bg-transparent autofill:shadow-[inset_0_0_0px_1000px_transparent] 
                        autofill:[-webkit-text-fill-color:var(--violet)] 
                        autofill:focus:bg-transparent autofill:focus:shadow-[inset_0_0_0px_1000px_transparent] 
                        autofill:hover:bg-transparent autofill:hover:shadow-[inset_0_0_0px_1000px_transparent]
                        [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_transparent] 
                        [&:-webkit-autofill]:[-webkit-text-fill-color:var(--violet)]
                        [&:-webkit-autofill:focus]:bg-transparent [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_transparent]
                        [&:-webkit-autofill:hover]:bg-transparent [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_transparent]`}
                    style={{
                        // Fallback para navegadores que no soportan las clases CSS
                        WebkitBoxShadow: variant === 'outline' ? 'inset 0 0 0px 1000px transparent' : undefined,
                        WebkitTextFillColor: variant === 'outline' ? 'white' : 'var(--violet)',
                    }}
                    {...props}
                />
            </div>
            
            {error && (
                <p className="mt-1 text-sm text-red-300">{error}</p>
            )}
            {helpText && !error && (
                <p className={`mt-1 text-sm ${variant === 'outline' ? 'text-[var(--violet-200)]' : 'text-gray-500'}`}>{helpText}</p>
            )}
        </div>
    );
});

Input.displayName = "Input";
export default Input;