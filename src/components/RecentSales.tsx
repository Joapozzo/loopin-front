// components/dashboard/RecentSales.tsx
import React from 'react';
import { SaleData } from '@/types/dashboard'; 

interface RecentSalesProps {
    sales: SaleData[];
    onViewAll?: () => void;
}

export const RecentSales: React.FC<RecentSalesProps> = ({ sales, onViewAll }) => {
    const getPaymentMethodColor = (method: string) => {
        switch (method) {
            case 'efectivo': return 'bg-green-100 text-green-800';
            case 'tarjeta': return 'bg-blue-100 text-blue-800';
            case 'digital': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--black)]">Ventas Recientes</h3>
                <button
                    onClick={onViewAll}
                    className="text-[var(--violet)] hover:text-[var(--violet-200)] text-sm font-medium"
                >
                    Ver todas
                </button>
            </div>
            <div className="space-y-4">
                {sales.slice(0, 5).map((sale) => (
                    <div
                        key={sale.id}
                        className="flex items-center justify-between p-4 hover:bg-[var(--gray-100)] rounded-lg transition-colors"
                    >
                        <div className="flex-1">
                            <p className="font-medium text-[var(--black)]">{sale.cliente}</p>
                            <p className="text-sm text-[var(--gray-400)]">
                                {sale.productos.join(', ')} • {sale.fecha.toLocaleTimeString()}
                            </p>
                        </div>
                        <div className="text-right mr-4">
                            <p className="font-semibold text-[var(--black)]">${sale.monto}</p>
                            <p className="text-sm text-[var(--violet)]">{sale.puntosOtorgados} puntos</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(sale.metodoPago)}`}>
                            {sale.metodoPago}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};