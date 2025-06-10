// components/dashboard/StatCard.tsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon,
    color,
    subtitle
}) => {
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)]">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white`}>
                    {icon}
                </div>
                {change !== undefined && (
                    <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-[var(--success)]' : isNegative ? 'text-[var(--rose)]' : 'text-[var(--gray-400)]'
                        }`}>
                        {isPositive && <ArrowUpRight size={16} />}
                        {isNegative && <ArrowDownRight size={16} />}
                        <span>{Math.abs(change)}%</span>
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-2xl font-bold text-[var(--black)] mb-1">{value}</h3>
                <p className="text-[var(--gray-400)] text-sm">{title}</p>
                {subtitle && <p className="text-[var(--gray-300)] text-xs mt-1">{subtitle}</p>}
            </div>
        </div>
    );
};