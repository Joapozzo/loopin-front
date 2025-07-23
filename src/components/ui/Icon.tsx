'use client';

import { 
    Home, User, Settings, Search, ArrowDownWideNarrow, Funnel, Bell, Plus, 
    IdCard, Heart, Ticket, Check, LogOut, Minus, ArrowUpWideNarrow 
} from "lucide-react";
import { ReactElement } from "react";

interface IconProps {
    name: string;
    backgroundColor?: string;
    iconColor?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    filled?: boolean;
}

export default function Icon({ 
    name, 
    backgroundColor = "var(--color-principal)", 
    iconColor = "white",
    onClick, 
    filled 
}: IconProps) {
    
    const iconProps = {
        color: iconColor,
        strokeWidth: 2,
        fill: filled ? iconColor : "none",
    };

    const icons: { [key: string]: ReactElement } = {
        home: <Home {...iconProps} />,
        user: <User {...iconProps} />,
        settings: <Settings {...iconProps} />,
        search: <Search {...iconProps} />,
        down: <ArrowDownWideNarrow {...iconProps} />,
        funnel: <Funnel {...iconProps} />,
        bell: <Bell {...iconProps} />,
        plus: <Plus {...iconProps} />,
        idcard: <IdCard {...iconProps} />,
        heart: <Heart {...iconProps} />,
        ticket: <Ticket {...iconProps} />,
        check: <Check {...iconProps} />,
        logout: <LogOut {...iconProps} />,
        up: <ArrowUpWideNarrow {...iconProps} />,
        minus: <Minus {...iconProps} />,
    };

    return (
        <div
            className="rounded-lg p-2 transition-all duration-200 cursor-pointer"
            style={{
                backgroundColor,
                border: `1px solid ${backgroundColor}`,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.7"; // Opacidad del 70%
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1"; // Vuelve a opacidad completa
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
            }}
            onClick={onClick}
        >
            <span style={{ 
                color: iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {icons[name] || <div>Icono no encontrado</div>}
            </span>
        </div>
    );
}