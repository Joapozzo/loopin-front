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
    onCustomChange?: (value: string | number) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    error,
    helpText,
    options,
    placeholder,
    icon,
    className = '',
    id,
    onChange,
    onCustomChange,
    ...props
}, ref) => {
    // FIX: usar useId() en lugar de Math.random()
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

    return (
        <div className="flex w-full flex-col gap-2">
            {label && (
                <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <div className="relative w-full">
                {icon && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--violet-200)]">
                        {icon}
                    </div>
                )}

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--violet-200)]">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                <select
                    ref={ref}
                    id={selectId}
                    className={`
            w-full rounded-lg p-3 text-sm font-medium bg-white border text-gray-700
            focus:outline-none focus:ring-2 appearance-none transition-all duration-200
            ${icon ? 'pl-10' : 'pl-3'} pr-10
            ${error
                            ? 'border-[var(--rose)] focus:ring-[var(--rose)] focus:border-[var(--rose)]'
                            : 'border-[var(--violet-100)] focus:ring-[var(--violet-200)] focus:border-[var(--violet-200)] hover:border-[var(--violet-200)]'
                        }
            ${className}
          `}
                    onChange={handleChange}
                    {...props}
                >
                    {placeholder && (
                        <option value="" className="text-gray-500">
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="text-gray-700 font-medium"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <p className="text-sm text-[var(--rose)] mt-1">{error}</p>
            )}
            {helpText && !error && (
                <p className="text-sm text-gray-400 mt-1">{helpText}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';
