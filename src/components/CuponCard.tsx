"use client";

import { CodigoCliente } from "@/types/codigos";
import { useProductos } from "@/hooks/useProductos";
import { useSucursales } from "@/hooks/useSucursales";
import { Hand, Package, MapPin } from "lucide-react";
import { useMemo } from "react";
import SpinnerLoader from "./ui/SpinerLoader";

interface CuponCardProps {
    codigo: CodigoCliente;
    onClick?: (codigo: CodigoCliente) => void;
    tipo?: "activos" | "inactivos";
}

export default function CuponCard({ codigo, onClick, tipo }: CuponCardProps) {
    const { getProductoById, tableConfig } = useProductos({
        mode: "general",
        enabled: true,
    });

    const { getSucursalById } = useSucursales({ enabled: true });

    const producto = useMemo(() => {
        return getProductoById(Number(codigo.pro_id));
    }, [getProductoById, codigo.pro_id]);

    const sucursal = useMemo(() => {
        return getSucursalById(codigo.suc_id, codigo.neg_id);
    }, [getSucursalById, codigo.suc_id]);

    const handleClick = () => {
        onClick?.(codigo);
    };

    if (tableConfig.loading) {
        return (
            <article className="flex-1 flex flex-col items-center justify-center h-44 min-w-[200px] text-[var(--white)] bg-[var(--violet-200)] p-4 rounded-lg animate-pulse">
                <SpinnerLoader />
                <p className="mt-2 text-sm text-[var(--violet)]">Cargando...</p>
            </article>
        );
    }

    // Estilos condicionales para cupones inactivos
    const isInactive = tipo === "inactivos";

    const cardBg = isInactive ? "bg-[var(--gray-400)]" : "bg-[var(--violet-200)]";
    const cardText = isInactive ? "text-[var(--gray-100)]" : "text-[var(--white)]";
    const accentText = isInactive ? "text-[var(--gray-200)]" : "text-[var(--violet-100)]";
    const iconColor = isInactive ? "text-[var(--gray-100)]" : "text-[var(--violet-100)]";

    return (
        <article
            className={`flex-1 flex flex-col items-start justify-between h-55 min-w-[220px] ${cardText} ${cardBg} p-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-opacity-90 hover:shadow-xl hover:-translate-y-1 cursor-pointer group`}
            onClick={handleClick}
        >
            <div className="flex w-full flex-col gap-3">
                {/* Header con tipo y código */}
                <div className="flex items-start gap-2 w-full justify-between">
                    <div className="flex items-center gap-2">
                        <Package size={18} className={accentText} />
                        <h3 className={`text-sm font-semibold ${accentText}`}>
                            CUPÓN DESCUENTO
                        </h3>
                    </div>
                    <Hand
                        size={20}
                        className={`${iconColor} group-hover:rotate-12 transition-transform duration-300`}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <h4 className="text-lg font-bold leading-tight">
                        {producto?.pro_nom || `Producto #${codigo.pro_id}`}
                    </h4>

                    {producto && (
                        <p className={`text-sm ${accentText}`}>
                            {producto.pro_puntos_canje} puntos de canje
                        </p>
                    )}
                </div>

                {/* Código del cupón */}
                <div className={`rounded py-1 w-fit`}>
                    <p className="text-sm font-mono font-medium tracking-wider">
                        Código
                    </p>
                    <p className="text-sm font-mono font-bold tracking-wider">
                        {codigo.cod_publico}
                    </p>
                </div>
            </div>

            {/* Footer con sucursal */}
            <div className="flex items-center gap-1 w-full mt-2">
                <MapPin size={14} className={iconColor} />
                <span className={`text-sm ${accentText} truncate`}>
                    {sucursal ? sucursal.suc_nom : `Sucursal #${codigo.suc_id}`}
                </span>
            </div>
        </article>
    );
}
