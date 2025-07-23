interface ButtonFilterCategoryProps {
    icon: string;
    label?: string;
    variant?: "mobile" | "desktop";
    isActive?: boolean;
    onClick?: () => void;
}

export default function ButtonFilterCategory({ 
    icon, 
    label, 
    variant = "mobile",
    isActive = false,
    onClick
}: ButtonFilterCategoryProps) {
    
    if (variant === "desktop") {
        return (
            <button 
                onClick={onClick}
                className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm
                    transition-all duration-300 ease-in-out whitespace-nowrap
                    ${isActive 
                        ? "bg-[var(--violet-200)] text-white shadow-lg scale-105" 
                        : "bg-[var(--violet-50)] text-[var(--violet)] hover:bg-[var(--violet-200)] hover:scale-105 hover:text-white"
                    }
                `}
            >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
            </button>
        );
    }

    // Vista mobile
    return (
        <button 
            onClick={onClick}
            className={`
                text-2xl py-2 px-5 rounded-lg flex items-center justify-center cursor-pointer 
                transition-all duration-300 ease-in-out
                ${isActive 
                    ? "bg-[var(--violet)] text-white shadow-lg text-3xl" 
                    : "bg-[var(--violet-50)] hover:text-4xl"
                }
            `}
        >
            {icon}
        </button>
    );
}