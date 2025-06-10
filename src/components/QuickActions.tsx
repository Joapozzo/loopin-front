// components/dashboard/QuickActions.tsx
import React from 'react';
import { Plus, Gift, Users, Eye } from 'lucide-react';

interface QuickActionItem {
    id: string;
    titulo: string;
    descripcion: string;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
}

interface QuickActionsProps {
    onNewSale?: () => void;
    onConfirmCanjes?: () => void;
    onViewClients?: () => void;
    onGenerateReport?: () => void;
    canjesPendientes?: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    onNewSale,
    onConfirmCanjes,
    onViewClients,
    onGenerateReport,
    canjesPendientes = 0
}) => {
    const actions: QuickActionItem[] = [
        {
            id: 'nueva-venta',
            titulo: 'Nueva Venta',
            descripcion: 'Registrar una nueva venta',
            icon: <Plus size={20} />,
            color: 'bg-[var(--violet)]',
            onClick: onNewSale
        },
        {
            id: 'confirmar-canje',
            titulo: 'Confirmar Canjes',
            descripcion: `${canjesPendientes} canjes pendientes`,
            icon: <Gift size={20} />,
            color: 'bg-[var(--rose)]',
            onClick: onConfirmCanjes
        },
        {
            id: 'ver-clientes',
            titulo: 'Ver Clientes',
            descripcion: 'Gestionar clientes adheridos',
            icon: <Users size={20} />,
            color: 'bg-[var(--skyblue)]',
            onClick: onViewClients
        },
        {
            id: 'reportes',
            titulo: 'Generar Reporte',
            descripcion: 'Exportar datos del día',
            icon: <Eye size={20} />,
            color: 'bg-[var(--success)]',
            onClick: onGenerateReport
        }
    ];

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)]">
            <h3 className="text-lg font-semibold text-[var(--black)] mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        className="flex items-center space-x-3 p-4 rounded-lg border border-[var(--gray-100)] hover:border-[var(--violet)] hover:bg-[var(--violet-50)] transition-all duration-200 text-left"
                    >
                        <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white`}>
                            {action.icon}
                        </div>
                        <div>
                            <p className="font-medium text-[var(--black)] text-sm">{action.titulo}</p>
                            <p className="text-xs text-[var(--gray-400)]">{action.descripcion}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};