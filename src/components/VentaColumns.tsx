import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Compra } from '@/types/venta';
import { formatDate } from '@/utils/utils';

export const createCompraColumns = (): ColumnDef<Compra>[] => [
    {
        accessorKey: 'com_nro_ticket',
        header: 'Nº Ticket',
        size: 120,
        cell: ({ row }) => {
            const ticket = row.getValue('com_nro_ticket') as string;
            return (
                <div className="font-mono text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        🎫 {ticket}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'com_monto',
        header: 'Monto',
        size: 140,
        cell: ({ row }) => {
            const monto = row.getValue('com_monto') as number;
            return (
                <div className="text-left">
                    <span className="text-lg font-medium text-[var(--violet)]">
                        ${monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'com_puntos_otorgados',
        header: 'Puntos Otorgados',
        size: 150,
        cell: ({ row }) => {
            const puntos = row.getValue('com_puntos_otorgados') as number;
            return (
                <div className="text-start">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--violet-50)] text-[var(--violet)]">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        +{puntos.toLocaleString()}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'com_fecha_compra',
        header: 'Fecha de Compra',
        size: 180,
        cell: ({ row }) => {
            const fecha = row.getValue('com_fecha_compra') as string;
            const fechaObj = new Date(fecha);

            return (
                <div className="text-sm">
                    <div className="text-[var(--black)] font-medium">
                        {formatDate(fecha)}
                    </div>
                    <div className="text-xs text-[var(--gray-400)]">
                        {fechaObj.toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}
                    </div>
                </div>
            );
        },
    },
    {
        id: 'ratio_puntos',
        header: 'Ratio P/$',
        size: 100,
        cell: ({ row }) => {
            const monto = row.getValue('com_monto') as number;
            const puntos = row.getValue('com_puntos_otorgados') as number;
            const ratio = monto > 0 ? (puntos / monto).toFixed(2) : '0.00';

            return (
                <div className="text-start">
                    <span className="text-xs font-mono px-2 py-1 bg-[var(--violet)] rounded">
                        {ratio}
                    </span>
                </div>
            );
        },
    },
];