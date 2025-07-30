"use client";
import React from 'react';
import { Package, Check } from 'lucide-react';
import { Product } from '@/types/product';
import Image from 'next/image';

export interface ProductoCardProps {
    producto: Product;
    onSelect: (producto: Product) => void;
    isSelected?: boolean;
}

export const ProductoCard: React.FC<ProductoCardProps> = ({
    producto,
    onSelect,
    isSelected = false
}) => {
    const handleClick = () => {
        onSelect(producto);
    };

    return (
        <div
            className={`relative cursor-pointer transition-all duration-200 hover:scale-102 ${isSelected
                    ? "rounded-lg ring-[var(--rose)] shadow-lg"
                    : "hover:shadow-md"
                }`}
            onClick={handleClick}
        >
            <div
                className={`bg-white rounded-xl border-2 p-4 h-full ${isSelected
                        ? "border-[var(--rose)] bg-[var(--rose)]"
                        : "border-gray-200 hover:border-[var(--rose)]"
                    }`}
            >
                {/* Selected indicator */}
                {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-[var(--rose)] text-white rounded-full p-1 shadow-lg">
                        <Check size={16} />
                    </div>
                )}

                {/* Imagen del producto */}
                <div className="relative mb-3 bg-gray-100 rounded-lg overflow-hidden aspect-square">
                    {producto.pro_url_foto ? (
                        <Image
                            src={producto.pro_url_foto}
                            alt={producto.pro_nom}
                            className="w-full h-full object-cover"
                            width={120}
                            height={120}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package size={32} className="text-gray-400" />
                        </div>
                    )}

                    {/* Overlay cuando está seleccionado */}
                    {isSelected && (
                        <div className="absolute inset-0 bg-[var(--rose)] bg-opacity-20 flex items-center justify-center">
                            <div className="bg-white rounded-full p-2 shadow-lg">
                                <Check size={20} className="text-[var(--rose)]" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Información del producto */}
                <div className="space-y-2">
                    <h3
                        className={`font-semibold text-sm leading-tight line-clamp-2 ${isSelected ? "text-[var(--rose)]" : "text-gray-800"
                            }`}
                    >
                        {producto.pro_nom}
                    </h3>

                    {producto.pro_puntos_canje && (
                        <p
                            className={`text-sm font-bold ${isSelected ? "text-[var(--rose)]" : "text-gray-700"
                                }`}
                        >
                            {producto.pro_puntos_canje.toLocaleString()} puntos
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};