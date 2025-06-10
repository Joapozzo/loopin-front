import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ClienteCompleto } from '../types/clienteCompleto';
import Button from './ui/buttons/Button';
import { formatDate, calculateAge } from '@/utils/utils';

interface ClienteActionsProps {
    cliente: ClienteCompleto;
    onEdit: (cliente: ClienteCompleto) => void;
    onDelete: (cliente: ClienteCompleto) => void;
}

const ClienteActions: React.FC<ClienteActionsProps> = ({ cliente, onEdit, onDelete }) => {
    return (
        <div className="flex items-center space-x-2">
            <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(cliente)}
                title="Editar cliente"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </Button>
            <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(cliente)}
                title="Eliminar cliente"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </Button>
        </div>
    );
};

export const createClienteColumns = (
    onEdit: (cliente: ClienteCompleto) => void,
    onDelete: (cliente: ClienteCompleto) => void
): ColumnDef<ClienteCompleto>[] => [
        {
            accessorKey: 'cli_id',
            header: 'ID',
            size: 80,
            cell: ({ row }) => (
                <span className="font-mono text-sm text-gray-500">
                    #{row.getValue('cli_id')}
                </span>
            ),
        },
        {
            accessorKey: 'cli_nom',
            header: 'Nombre',
            cell: ({ row }) => {
                const nombre = row.getValue('cli_nom') as string;
                const apellido = row.original.cli_ape;
                return (
                    <div>
                        <div className="font-medium text-gray-500">
                            {nombre} {apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                            DNI: {row.original.usu_dni}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'usu_mail',
            header: 'Contacto',
            cell: ({ row }) => {
                const email = row.getValue('usu_mail') as string;
                const telefono = row.original.usu_cel;
                return (
                    <div>
                        <div className="text-sm text-gray-500">{email}</div>
                        <div className="text-sm text-gray-500">{telefono}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'cli_fecha_nac',
            header: 'Edad',
            cell: ({ row }) => {
                const fechaNac = row.getValue('cli_fecha_nac') as string;
                const edad = calculateAge(fechaNac);
                return (
                    <div>
                        <div className="text-sm text-gray-500">{edad} años</div>
                        <div className="text-xs text-gray-500">
                            {formatDate(fechaNac)}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'usu_activo',
            header: 'Estado',
            cell: ({ row }) => {
                const activo = row.getValue('usu_activo') as number;
                return (
                    <div className="flex items-center">
                        <div className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${activo === 1
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
          `}>
                            <div className={`
              w-1.5 h-1.5 rounded-full mr-1.5
              ${activo === 1 ? 'bg-green-400' : 'bg-red-400'}
            `} />
                            {activo === 1 ? 'Activo' : 'Inactivo'}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'usu_fecha_alto',
            header: 'Registro',
            cell: ({ row }) => {
                const fechaAlta = row.original.usu_fecha_alta;
                const loginCount = row.original.usu_login_count;
                return (
                    <div>
                        <div className="text-sm text-gray-500">
                            {formatDate(fechaAlta)}
                        </div>
                        <div className="text-xs text-gray-500">
                            {loginCount} accesos
                        </div>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Acciones',
            size: 120,
            cell: ({ row }) => (
                <ClienteActions
                    cliente={row.original}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        },
    ];