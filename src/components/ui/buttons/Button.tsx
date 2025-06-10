import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "light";
    fullWidth?: boolean;
    rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
        "bg-[var(--violet)] text-[var(--white)] border border-[var(--violet)] hover:bg-transparent hover:text-[var(--violet)]",
    secondary:
        "bg-[var(--gray)] text-[var(--black)] border border-[var(--gray)] hover:bg-transparent hover:text-[var(--gray)]",
    outline:
        "bg-transparent text-[var(--violet)] border border-[var(--violet)] hover:bg-[var(--violet)] hover:text-[var(--white)]",
    danger:
        "bg-red-500 text-white border border-red-500 hover:bg-transparent hover:text-red-500",
    success:
        "bg-green-500 text-white border border-green-500 hover:bg-transparent hover:text-green-500",
    light:
        "bg-[var(--violet-200)] text-[var(--violet-600)] border-[var(--violet-200)] hover:bg-white hover:text-[var(--violet)] hover:border-white"
};

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
};

const roundedClasses: Record<"sm" | "md" | "lg" | "xl" | "2xl" | "full", string> = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
};

export default function Button({
    variant = "primary",
    fullWidth = false,
    rounded = "lg",
    size = "md",
    children,
    className = "",
    disabled = false,
    ...props
}: ButtonProps) {
    const classes = `
        transition-all duration-300 font-bold
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
        ${className}
    `.trim();

    return (
        <button
            className={classes}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
