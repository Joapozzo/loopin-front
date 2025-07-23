import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

import Button from './ui/buttons/Button';
import { formatDate } from '@/utils/utils';
import { CanjeUnificado, TipoHistorialCanje } from '@/types/canje';

interface CanjeActionsProps {
    canje: CanjeUnificado;
    onDelete: (canje: CanjeUnificado) => void;
}

const CanjeActions: React.FC<CanjeActionsProps> = ({ canje, onDelete }) => {
    return (
        <div className="flex items-center space-x-2">
            <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(canje)}
                title="Anular canje"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </Button>
        </div>
    );
};

export const createCanjeColumns = (
    onDelete: (canje: CanjeUnificado) => void
): ColumnDef<CanjeUnificado>[] => [
        {
            accessorKey: 'tipo',
            header: 'Tipo',
            cell: ({ row }) => {
                const tipo = row.getValue('tipo') as TipoHistorialCanje;
                return (
                    <div className="text-start">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tipo === 'encargado'
                                ? 'bg-blue-100 text-blue-800'
                                : tipo === 'promocion'
                                    ? 'bg-purple-100 text-purple-800'
                                    : tipo === 'puntos'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                            }`}>
                            {tipo === 'encargado' ? (
                                <>
                                    👤 Encargado
                                </>
                            ) : tipo === 'promocion' ? (
                                <>
                                    🎯 Promocional
                                </>
                            ) : tipo === 'puntos' ? (
                                <>
                                    💰 Puntos
                                </>
                            ) : (
                                <>
                                    📋 Cliente
                                </>
                            )}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'nro_ticket',
            header: 'Ticket',
            cell: ({ row }) => {
                const ticket = row.getValue('nro_ticket') as string;
                if (!ticket) {
                    return (
                        <div className="text-start text-gray-400">
                            <span className="text-sm">-</span>
                        </div>
                    );
                }
                return (
                    <div className="font-mono text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            📋 {ticket}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'usu_dni',
            header: 'Cliente',
            cell: ({ row }) => {
                const dni = row.getValue('usu_dni') as string;
                return (
                    <div>
                        <div className="text-sm font-medium text-[var(--black)]">
                            DNI: {dni}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'producto_nombre',
            header: 'Producto',
            cell: ({ row }) => {
                const producto = row.getValue('producto_nombre') as string;
                const tipo = row.original.tipo;

                if (!producto) {
                    return (
                        <div className="text-start text-gray-400">
                            <span className="text-sm">
                                {tipo === 'puntos' ? '💰 Cupón de puntos' : '-'}
                            </span>
                        </div>
                    );
                }

                return (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm">🍽️</span>
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-[var(--black)]">{producto}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'codigo_publico',
            header: 'Código',
            cell: ({ row }) => {
                const codigo = row.getValue('codigo_publico') as string;
                if (!codigo) {
                    return (
                        <div className="text-center text-gray-400">
                            <span className="text-sm">-</span>
                        </div>
                    );
                }
                return (
                    <div className="font-mono text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--violet-50)] text-[var(--violet)]">
                            🏷️ {codigo}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'encargado_nombre',
            header: 'Encargado',
            cell: ({ row }) => {
                const encargado = row.getValue('encargado_nombre') as string;
                const tipo = row.original.tipo;

                if (!encargado || tipo === 'cliente') {
                    return (
                        <div className="text-start text-gray-400">
                            <span className="text-sm">-</span>
                        </div>
                    );
                }

                return (
                    <div className="text-sm">
                        <div className="text-[var(--black)] font-medium">
                            {encargado}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'puntos_trans',
            header: 'Puntos',
            cell: ({ row }) => {
                const tipo = row.original.tipo;
                const puntos = row.original.puntos_trans;

                if (tipo === 'promocion') {
                    return (
                        <div className="text-start">
                            <span className="text-sm text-purple-600 font-medium">
                                🎁 Promoción
                            </span>
                        </div>
                    );
                }

                if (tipo === 'puntos' && puntos) {
                    return (
                        <div className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                +{puntos.toLocaleString()}
                            </span>
                        </div>
                    );
                }

                if (tipo === 'encargado') {
                    return (
                        <div className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Canje
                            </span>
                        </div>
                    );
                }

                return (
                    <div className="text-center text-gray-400">
                        <span className="text-sm">-</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'fecha_canje',
            header: 'Fecha',
            cell: ({ row }) => {
                const fecha = row.getValue('fecha_canje') as string;
                return (
                    <div className="text-sm">
                        <div className="text-[var(--black)]">
                            {formatDate(fecha)}
                        </div>
                        <div className="text-xs text-[var(--gray-400)]">
                            {new Date(fecha).toLocaleTimeString('es-AR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                );
            },
        },
        // {
        //     id: 'actions',
        //     header: 'Acciones',
        //     size: 100,
        //     cell: ({ row }) => (
        //         <CanjeActions
        //             canje={row.original}
        //             onDelete={onDelete}
        //         />
        //     ),
        // },
    ];