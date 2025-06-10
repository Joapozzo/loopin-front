'use client';

import { Home, User, Settings, Search, ArrowDownWideNarrow, Funnel, Bell, Plus, IdCard, Heart, Ticket, Check, LogOut } from "lucide-react";
import { ReactElement, useRef } from "react";

interface IconProps {
    name: string;
    colorVar?: string;
    hoverColor?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    filled?: boolean;
}

export default function Icon({ name, colorVar, hoverColor, onClick, filled }: IconProps) {
    const iconProps = {
        color: "var(--white)",
        strokeWidth: 2,
        fill: filled ? "var(--white)" : "none", // Cambiamos aquí
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
    };

    const backgroundColor = colorVar ? `var(${colorVar})` : `var(--violet-200)`;
    const iconHoverColor = colorVar ? `var(${colorVar})` : "var(--violet-200)";
    const hoverBg = hoverColor ? `var(${hoverColor})` : "transparent";

    const spanRef = useRef<HTMLSpanElement>(null);

    return (
        <div
            className="rounded-xl p-2 border-1 transition-all duration-300"
            style={{
                backgroundColor,
                borderColor: backgroundColor,
                cursor: "pointer",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
                if (spanRef.current) {
                    spanRef.current.style.color = iconHoverColor;
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = backgroundColor;
                if (spanRef.current) {
                    spanRef.current.style.color = "var(--white)";
                }
            }}
            onClick={onClick}
        >
            <span ref={spanRef} style={{ color: "var(--white)" }}>
                {icons[name] || <div>Icono no encontrado</div>}
            </span>
        </div>
    );
}
