// components/dashboard/SimpleChart.tsx
import React from 'react';

interface SimpleChartProps {
    title: string;
    data: number[];
    labels: string[];
    color: string;
    height?: string;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
    title,
    data,
    labels,
    color,
    height = "h-64"
}) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)]">
            <h3 className="text-lg font-semibold text-[var(--black)] mb-4">{title}</h3>
            
            {/* ✅ Contenedor principal con altura fija */}
            <div className="relative w-full" style={{ height: '240px' }}>
                {/* ✅ Contenedor de barras */}
                <div className="flex items-end justify-between h-full pb-12 space-x-2">
                    {data.map((value, index) => {
                        // ✅ Cálculo mejorado del porcentaje
                        const percentage = maxValue === minValue
                            ? 50
                            : ((value - minValue) / (maxValue - minValue)) * 80 + 15;
                        
                        // ✅ Altura en píxeles para mayor precisión
                        const barHeight = (percentage / 100) * 180; // 180px es la altura disponible para barras

                        return (
                            <div key={index} className="flex-1 flex flex-col items-center relative">
                                {/* ✅ Barra con altura absoluta */}
                                <div
                                    className={`w-full ${color} rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer relative group`}
                                    style={{ height: `${barHeight}px`, minHeight: '8px' }}
                                >
                                    {/* ✅ Tooltip con el valor */}
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {value}
                                    </div>
                                </div>
                                
                                {/* ✅ Labels en posición absoluta */}
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                                    <span className="text-xs text-[var(--gray-400)] block">{labels[index]}</span>
                                    <span className="text-xs font-medium text-[var(--black)] block">{value}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};