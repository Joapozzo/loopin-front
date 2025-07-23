import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ClienteCompleto } from '../types/clienteCompleto';
import { formatDate, calculateAge } from '@/utils/utils';

export const createClienteColumns = (): ColumnDef<ClienteCompleto>[] => [
    {
        accessorKey: "cli_id",
        header: "ID",
        size: 80,
        cell: ({ row }) => (
            <span className="font-mono text-sm text-gray-500">
                #{row.getValue("cli_id")}
            </span>
        ),
    },
    {
        accessorKey: "cli_nom",
        header: "Nombre",
        cell: ({ row }) => {
            const nombre = row.getValue("cli_nom") as string;
            return (
                <div className="font-medium text-gray-900">
                    {nombre}
                </div>
            );
        },
    },
    {
        accessorKey: "cli_ape",
        header: "Apellido",
        cell: ({ row }) => (
            <span className="text-gray-700">{row.getValue("cli_ape")}</span>
        ),
    },
    {
        accessorKey: "cli_fec_nac",
        header: "Edad",
        cell: ({ row }) => {
            const fechaNac = row.getValue("cli_fec_nac") as string;
            const edad = calculateAge(fechaNac);
            return (
                <div>
                    <div className="text-sm text-gray-900">{edad} años</div>
                    <div className="text-xs text-gray-500">{formatDate(fechaNac)}</div>
                </div>
            );
        },
    },
];