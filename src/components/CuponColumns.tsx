import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { CuponView, EstadoCupon } from '../types/codigos';
import Button from '../components/ui/buttons/Button';

interface CuponActionsProps {
    cupon: CuponView;
    onEdit: (cupon: CuponView) => void;
    // onDelete: (cupon: CuponView) => void;
}

const CuponActions: React.FC<CuponActionsProps> = ({ cupon, onEdit }) => {
    return (
        <div className="flex items-center space-x-2">
            <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(cupon)}
                title="Editar cupón"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </Button>
            {/* <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(cupon)}
                title="Eliminar cupón"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </Button> */}
        </div>
    );
};

// Función helper para formatear fechas
const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch {
        return dateString;
    }
};

// Función helper para calcular días restantes
const getDaysRemaining = (expirationDate: string): number => {
    try {
        const now = new Date();
        const expiration = new Date(expirationDate);
        const diffTime = expiration.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
        return 0;
    }
};

export const createCuponColumns = (
    onEdit: (cupon: CuponView) => void,
    onDelete: (cupon: CuponView) => void
): ColumnDef<CuponView>[] => [
        {
            accessorKey: 'codigo_publico',
            header: 'Código',
            cell: ({ row }) => {
                const codigo = row.getValue('codigo_publico') as string;
                return (
                    <div className="font-mono">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--violet-50)] text-[var(--violet)]">
                            🏷️ {codigo}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'tipo',
            header: 'Tipo',
            cell: ({ row }) => {
                const tipo = row.getValue('tipo') as 'promocional' | 'puntos';
                return (
                    <div className="text-start">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tipo === 'promocional'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                            }`}>
                            {tipo === 'promocional' ? (
                                <>Promoción</>
                            ) : (
                                <>Puntos</>
                            )}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'contenido',
            header: 'Contenido',
            cell: ({ row }) => {
                const cupon = row.original;

                if (cupon.tipo === 'promocional' && cupon.producto_nombre) {
                    return (
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center">
                                    <span className="text-orange-600 text-lg">🍽️</span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-sm font-medium text-[var(--black)]">
                                    {cupon.producto_nombre}
                                </div>
                                <div className="text-sm text-orange-600">
                                    Producto gratuito
                                </div>
                            </div>
                        </div>
                    );
                }

                if (cupon.tipo === 'puntos' && cupon.cantidad_puntos) {
                    return (
                        <div className="text-center flex">
                            <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-lg bg-green-100 border border-green-200 flex items-center justify-center">
                                    <span className="text-orange-600 text-lg">➕</span>
                                </div>
                            </div>
                            <div className="flex flex-col ml-3 text-start">
                                <div className="text-sm font-bold text-green-600">
                                    +{cupon.cantidad_puntos.toLocaleString()} puntos
                                </div>
                                <div className="text-sm text-[var(--gray-400)]">
                                    Canje directo
                                </div>
                            </div>
                        </div>
                    );
                }

                return <span className="text-[var(--gray-400)]">-</span>;
            },
        },
        {
            accessorKey: 'uso_maximo',
            header: 'Usos Disponibles',
            cell: ({ row }) => {
                const usoMaximo = row.getValue('uso_maximo') as number;
                const estado = row.original.estado;

                // Para los datos actuales no tenemos uso_actual, así que mostramos solo el máximo
                return (
                    <div className="text-start">
                        <div className="text-sm font-medium text-[var(--black)]">
                            {usoMaximo} {usoMaximo === 1 ? 'uso' : 'usos'}
                        </div>
                        {estado === 'AGOTADO' && (
                            <div className="text-xs text-red-600 mt-1">
                                Sin usos disponibles
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'fecha_expiracion',
            header: 'Vigencia',
            cell: ({ row }) => {
                const fechaExpiracion = row.getValue('fecha_expiracion') as string;
                const diasRestantes = getDaysRemaining(fechaExpiracion);

                return (
                    <div className="text-sm">
                        <div className="text-[var(--black)]">
                            {formatDate(fechaExpiracion)}
                        </div>
                        <div className={`text-xs ${diasRestantes < 0
                            ? 'text-red-600'
                            : diasRestantes <= 7
                                ? 'text-yellow-600'
                                : 'text-green-600'
                            }`}>
                            {diasRestantes < 0
                                ? 'Expirado'
                                : diasRestantes === 0
                                    ? 'Expira hoy'
                                    : `${diasRestantes} días`
                            }
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            cell: ({ row }) => {
                const estado = row.getValue('estado') as EstadoCupon;

                const getEstadoConfig = () => {
                    switch (estado) {
                        case 'ACTIVO':
                            return {
                                bg: 'bg-green-100',
                                text: 'text-green-800',
                                dot: 'bg-green-400',
                                label: 'Activo'
                            };
                        case 'AGOTADO':
                            return {
                                bg: 'bg-yellow-100',
                                text: 'text-yellow-800',
                                dot: 'bg-yellow-400',
                                label: 'Agotado'
                            };
                        case 'CANCELADO':
                            return {
                                bg: 'bg-gray-100',
                                text: 'text-gray-800',
                                dot: 'bg-gray-400',
                                label: 'Cancelado'
                            };
                        case 'CANJEADO':
                            return {
                                bg: 'bg-blue-100',
                                text: 'text-blue-800',
                                dot: 'bg-blue-400',
                                label: 'Canjeado'
                            };
                        case 'EXPIRADO':
                            return {
                                bg: 'bg-red-100',
                                text: 'text-red-800',
                                dot: 'bg-red-400',
                                label: 'Expirado'
                            };
                        case 'PAUSADO':
                            return {
                                bg: 'bg-orange-100',
                                text: 'text-orange-800',
                                dot: 'bg-orange-400',
                                label: 'Pausado'
                            };
                        default:
                            return {
                                bg: 'bg-gray-100',
                                text: 'text-gray-800',
                                dot: 'bg-gray-400',
                                label: estado
                            };
                    }
                };

                const config = getEstadoConfig();

                return (
                    <div className="text-start">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`} />
                            {config.label}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'fecha_emision',
            header: 'Fecha Emisión',
            cell: ({ row }) => {
                const fechaEmision = row.getValue('fecha_emision') as string;
                return (
                    <div className="text-sm text-[var(--black)]">
                        {formatDate(fechaEmision)}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Acciones',
            size: 120,
            cell: ({ row }) => (
                <CuponActions
                    cupon={row.original}
                    onEdit={onEdit}
                // onDelete={onDelete}
                />
            ),
        },
    ];