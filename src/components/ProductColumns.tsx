import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '../types/product';
import Button from './ui/buttons/Button'; 

interface ProductoActionsProps {
    producto: Product;
    onEdit: (producto: Product) => void;
    onDelete: (producto: Product) => void;
}

const ProductoActions: React.FC<ProductoActionsProps> = ({ producto, onEdit, onDelete }) => {
    return (
        <div className="flex items-center space-x-2">
            <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(producto)}
                title="Editar producto"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </Button>
            <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(producto)}
                title="Eliminar producto"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </Button>
        </div>
    );
};

export const createProductoColumns = (
    onEdit: (producto: Product) => void,
    onDelete: (producto: Product) => void
): ColumnDef<Product>[] => [
        {
            accessorKey: 'pro_id',
            header: 'ID',
            size: 80,
            cell: ({ row }) => (
                <span className="font-mono text-sm text-[var(--gray-400)]">
                    #{row.getValue('pro_id')}
                </span>
            ),
        },
        {
            accessorKey: 'pro_nom',
            header: 'Producto',
            cell: ({ row }) => {
                const nombre = row.getValue('pro_nom') as string;
                const imagen = row.original.pro_url_foto;
                return (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <img
                                className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                                src={imagen || '/placeholder-product.png'}
                                alt={nombre}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-product.png';
                                }}
                            />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-[var(--black)]">{nombre}</div>
                            <div className="text-sm text-[var(--gray-400)]">ID: {row.original.pro_id}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'pro_puntos_canje',
            header: 'Puntos',
            cell: ({ row }) => {
                const puntos = row.getValue('pro_puntos_canje') as number;
                return (
                    <div className="text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--violet-50)] text-[var(--violet)]">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                            </svg>
                            {puntos.toLocaleString()}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'pro_cantidad',
            header: 'Stock',
            cell: ({ row }) => {
                const cantidad = row.getValue('pro_cantidad') as number;
                const isLowStock = cantidad <= 5;
                return (
                    <div className="text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cantidad > 10
                                ? 'bg-green-100 text-green-800'
                                : isLowStock
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${cantidad > 10
                                    ? 'bg-green-400'
                                    : isLowStock
                                        ? 'bg-red-400'
                                        : 'bg-yellow-400'
                                }`} />
                            {cantidad}
                        </span>
                        {isLowStock && (
                            <div className="text-xs text-red-600 mt-1">Stock bajo</div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'res_id',
            header: 'Restaurante',
            cell: ({ row }) => {
                const resId = row.getValue('res_id') as number;
                return (
                    <div className="text-sm text-[var(--gray-400)]">
                        Resto #{resId}
                    </div>
                );
            },
        },
        {
            accessorKey: 'pro_tip_id',
            header: 'Tipo',
            cell: ({ row }) => {
                const tipoId = row.getValue('pro_tip_id') as number;
                // Aquí puedes mapear los tipos según tu lógica
                const tipos = {
                    1: 'Bebida',
                    2: 'Comida',
                    3: 'Postre',
                    4: 'Entrada'
                };
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tipos[tipoId as keyof typeof tipos] || `Tipo ${tipoId}`}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: 'Acciones',
            size: 120,
            cell: ({ row }) => (
                <ProductoActions
                    producto={row.original}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        },
    ];