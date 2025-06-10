// components/dashboard/TopProducts.tsx
import React from 'react';
import { ProductoVendido } from '@/types/dashboard'; 

interface TopProductsProps {
    products: ProductoVendido[];
    maxItems?: number;
}

export const TopProducts: React.FC<TopProductsProps> = ({ products, maxItems = 5 }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)]">
            <h3 className="text-lg font-semibold text-[var(--black)] mb-4">Productos Más Vendidos</h3>
            <div className="space-y-4">
                {products.slice(0, maxItems).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[var(--violet)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                            </div>
                            <div>
                                <p className="font-medium text-[var(--black)]">{product.nombre}</p>
                                <p className="text-sm text-[var(--gray-400)]">{product.categoria}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-[var(--black)]">{product.cantidad} und</p>
                            <p className="text-sm text-[var(--gray-400)]">${product.monto.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};