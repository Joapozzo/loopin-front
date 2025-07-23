"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { StarIcon, Star } from "lucide-react";
import { motion } from "framer-motion";

interface PuntosCounterProps {
    tarjetaActual: any; // Tipo de tarjeta
    restauranteSeleccionado: any; // Tipo de restaurante
    variant?: 'mobile' | 'desktop' | 'simple'; // Variantes de diseño
    className?: string;
    children?: (points: number) => React.ReactNode;
}

export default function PuntosCounter({
    tarjetaActual,
    restauranteSeleccionado,
    variant = 'simple',
    className = ""
}: PuntosCounterProps) {
    const queryClient = useQueryClient();
    const [points, setPoints] = useState(0);

    useEffect(() => {
        if (restauranteSeleccionado && tarjetaActual) {
            const puntosActuales = tarjetaActual.tar_puntos_disponibles || 0;

            // Verificar si hay un canje reciente
            const canjeData = queryClient.getQueryData(['ultimo_canje_puntos']) as any;
            const hayCanjeReciente = canjeData && (Date.now() - canjeData.timestamp < 3000);

            if (hayCanjeReciente && points > 0) {
                // DESCUENTO: Animar desde puntos actuales hacia nuevos puntos
                let current = points;
                const duration = 800;
                const decrement = (points - puntosActuales) / (duration / 16);

                const interval = setInterval(() => {
                    current -= decrement;
                    if (current <= puntosActuales) {
                        current = puntosActuales;
                        clearInterval(interval);
                        queryClient.removeQueries({ queryKey: ['ultimo_canje_puntos'] });
                    }
                    setPoints(Math.floor(current));
                }, 16);

                return () => clearInterval(interval);
            } else {
                // CONTEO NORMAL: Animar desde 0 hacia arriba
                let start = 0;
                const duration = 1000;
                const increment = puntosActuales / (duration / 16);

                const interval = setInterval(() => {
                    start += increment;
                    if (start >= puntosActuales) {
                        start = puntosActuales;
                        clearInterval(interval);
                    }
                    setPoints(Math.floor(start));
                }, 16);

                return () => clearInterval(interval);
            }
        } else {
            setPoints(0);
        }
    }, [restauranteSeleccionado, tarjetaActual, queryClient]);

    // Variante mobile (header fijo)
    if (variant === 'mobile') {
        return (
            <motion.div
                className={`fixed top-0 left-1/2 -translate-x-1/2 w-[50%] max-w-md bg-[var(--violet)] rounded-b-3xl z-50 flex flex-col items-center justify-center shadow-xl pb-3 z-999 ${className}`}
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -60 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h4 className="text-white text-2xl font-bold mt-4 flex items-center gap-2">
                    <StarIcon className='w-4 h-4 text-yellow-300' />
                    <span>{points}</span> puntos
                </h4>
                <p className="text-white/90 text-sm">
                    en {restauranteSeleccionado?.suc_nom}
                </p>
            </motion.div>
        );
    }

    // Variante desktop (card)
    if (variant === 'desktop') {
        return (
            <motion.div
                className={`bg-[var(--violet-50)] text-[var(--violet)] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
                whileHover={{ y: -2 }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[var(--violet-200)] rounded-lg flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">{points}</h3>
                        <p className="text-[var(--violet-200)] text-sm">Puntos disponibles</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Variante simple (solo número)
    return (
        <span className={className}>
            {points}
        </span>
    );
}