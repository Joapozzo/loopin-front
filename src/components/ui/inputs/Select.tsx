import { ArrowDown } from 'lucide-react';
import React, { forwardRef, ReactElement, useId } from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helpText?: string;
    options: SelectOption[];
    placeholder?: string;
    icon?: ReactElement;
    variant?: 'default' | 'modal' | 'input' | 'desktop';
    onCustomChange?: (value: string | number) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    error,
    helpText,
    options,
    placeholder,
    icon,
    variant = 'default',
    className = '',
    id,
    onChange,
    onCustomChange,
    ...props
}, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onChange) {
            onChange(e);
        }

        if (onCustomChange) {
            const value = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value);
            onCustomChange(value);
        }
    };

    const getStyles = () => {
        if (variant === 'modal') {
            return {
                container: "flex w-full flex-col gap-2",
                label: `block text-sm font-medium text-[var(--violet-100)] mb-2`,
                selectWrapper: `relative flex items-center rounded-md w-full focus-within:ring-2 border transition-all duration-200 ${error
                    ? 'border-red-300 focus-within:ring-red-300'
                    : 'border-[var(--violet-200)] focus-within:ring-[var(--violet-200)] bg-transparent hover:border-white'
                    } ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
                iconContainer: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--violet-100)] z-20",
                arrowContainer: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--violet-100)] z-10",
                select: `w-full bg-transparent border-none outline-none text-lg font-medium text-white py-2 appearance-none ${icon ? 'pl-10' : 'pl-3'} pr-10 ${props.disabled ? 'cursor-not-allowed' : ''}`,
                option: "bg-[var(--violet-200)] text-white",
                placeholderOption: "bg-[var(--violet-200)] text-[var(--violet-50)]",
                error: "mt-1 text-sm text-red-300",
                helpText: "text-sm text-[var(--violet-200)] mt-1"
            };
        }

        if (variant === 'input') {
            return {
                container: "w-full",
                label: "block text-sm font-medium mb-2 text-[var(--black)]",
                selectWrapper: `relative flex items-center rounded-md w-full focus-within:ring-2 border transition-all duration-200 ${error
                    ? "bg-[var(--violet-50)] focus-within:ring-red-300 border-red-500"
                    : "bg-[var(--violet-50)] focus-within:ring-[var(--violet-200)] border-transparent"
                    } ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`,
                iconContainer: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--violet)] z-10",
                arrowContainer: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--violet-200)] z-10",
                select: `w-full bg-transparent border-none outline-none text-lg font-medium text-[var(--violet)] py-2 appearance-none ${icon ? 'pl-10' : 'pl-3'} pr-10 ${props.disabled ? "cursor-not-allowed" : ""}`,
                option: "text-gray-700 font-medium",
                placeholderOption: "text-[var(--violet-200)] font-medium",
                error: "mt-1 text-sm text-red-300",
                helpText: "mt-1 text-sm text-gray-500",
            };
        }

        if (variant === 'desktop') {
            return {
                container: "flex w-full flex-col gap-2",
                label: "text-sm font-medium text-gray-600",
                selectWrapper: "relative w-full",
                iconContainer: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--violet-200)] z-10",
                arrowContainer: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--violet-200)] z-10",
                select: `w-full rounded-lg text-sm font-medium bg-white border text-gray-700 focus:outline-none focus:ring-2 appearance-none py-3 transition-all duration-200 ${icon ? "pl-10" : "pl-3"} pr-10 ${error
                    ? "border-[var(--rose)] focus:ring-[var(--rose)] focus:border-[var(--rose)]"
                    : "border-[var(--violet-100)] focus:ring-[var(--violet-200)] focus:border-[var(--violet-200)] hover:border-[var(--violet-200)]"
                    } ${props.disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`,
                option: "text-gray-700 font-medium",
                placeholderOption: "text-gray-500",
                error: "text-sm text-[var(--rose)] mt-1",
                helpText: "text-sm text-gray-400 mt-1",
            };
        }

        // Default styles
        return {
            container: "flex w-full flex-col gap-2",
            label: "text-sm font-medium text-white",
            selectWrapper: "relative w-full",
            iconContainer: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--violet-200)] z-10",
            arrowContainer: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--violet-200)] z-10",
            select: `w-full rounded-lg text-sm font-medium bg-white border text-gray-700 focus:outline-none focus:ring-2 appearance-none py-3 transition-all duration-200 ${icon ? 'pl-10' : 'pl-3'} pr-10 ${error
                ? 'border-[var(--rose)] focus:ring-[var(--rose)] focus:border-[var(--rose)]'
                : 'border-[var(--violet-100)] focus:ring-[var(--violet-200)] focus:border-[var(--violet-200)] hover:border-[var(--violet-200)]'
                } ${props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`,
            option: "text-gray-700 font-medium",
            placeholderOption: "text-gray-500",
            error: "text-sm text-[var(--rose)] mt-1",
            helpText: "text-sm text-gray-400 mt-1"
        };
    };

    const styles = getStyles();

    return (
        <div className={styles.container}>
            {label && (
                <label htmlFor={selectId} className={styles.label}>
                    {label}
                </label>
            )}

            <div className={styles.selectWrapper}>
                {/* Ícono a la izquierda (si existe) */}
                {icon && (
                    <div className={styles.iconContainer}>
                        {icon}
                    </div>
                )}

                {/* Select ocupa todo el ancho */}
                <select
                    ref={ref}
                    id={selectId}
                    className={`${styles.select} ${className}`}
                    onChange={handleChange}
                    {...props}
                >
                    {placeholder && (
                        <option value="" className={styles.placeholderOption}>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className={styles.option}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Flecha siempre a la derecha */}
                <div className={styles.arrowContainer}>
                    <ArrowDown className="w-4 h-4" />
                </div>
            </div>

            {error && (
                <p className={styles.error}>{error}</p>
            )}
            {helpText && !error && (
                <p className={styles.helpText}>{helpText}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';