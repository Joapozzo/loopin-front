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

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)]">
            <h3 className="text-lg font-semibold text-[var(--black)] mb-4">{title}</h3>
            <div className={`${height} flex items-end justify-between space-x-2`}>
                {data.map((value, index) => {
                    const percentage = (value / maxValue) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                                className={`w-full ${color} rounded-t-md transition-all duration-500 hover:opacity-80`}
                                style={{ height: `${percentage}%`, minHeight: '4px' }}
                            />
                            <span className="text-xs text-[var(--gray-400)] mt-2">{labels[index]}</span>
                            <span className="text-xs font-medium text-[var(--black)]">{value}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};