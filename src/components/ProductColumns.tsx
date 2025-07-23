import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '../types/product';
import Button from './ui/buttons/Button';
import { CategoriaProducto } from '@/types/CategoriaProducto';
import { CheckCircle, XCircle } from 'lucide-react';

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
                variant="outline"
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
                disabled={producto.pro_activo === 0}
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
    onDelete: (producto: Product) => void,
    categorias: CategoriaProducto[]

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

                // Imagen placeholder en base64 (nunca falla)
                const placeholderImage = "data:image/svg+xml;base64," + btoa(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#f3f4f6" rx="8"/>
                <path d="M16 18a2 2 0 0 1 4 0v4a2 2 0 0 1-4 0v-4zM22 18a2 2 0 0 1 4 0v4a2 2 0 0 1-4 0v-4z" fill="#9ca3af"/>
                <path d="M14 26h12v2H14v-2z" fill="#9ca3af"/>
            </svg>
        `);

                return (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <img
                                className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                                src={imagen || placeholderImage}
                                alt={nombre}
                                onError={(e) => {
                                    // Solo cambiar si no es ya el placeholder
                                    if ((e.target as HTMLImageElement).src !== placeholderImage) {
                                        (e.target as HTMLImageElement).src = placeholderImage;
                                    }
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
                    <div className="text-start">
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
            accessorKey: 'pro_cantidad_disp',
            header: 'Stock',
            cell: ({ row }) => {
                // Obtener el valor y convertirlo a número, manejando casos edge
                const rawCantidad = row.getValue('pro_cantidad_disp');
                const cantidad = rawCantidad ? Number(rawCantidad) : 0;

                // Debug: descomenta esta línea para ver qué valores recibes
                // console.log('Stock para producto:', row.original.pro_id, 'Raw:', rawCantidad, 'Parsed:', cantidad);

                // Validar que sea un número válido
                if (isNaN(cantidad)) {
                    return (
                        <div className="text-start">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Sin datos
                            </span>
                        </div>
                    );
                }

                const isLowStock = cantidad <= 5;
                const isGoodStock = cantidad > 10;
                const isMediumStock = cantidad >= 6 && cantidad <= 10;

                // Determinar colores
                let badgeClasses = '';
                let dotClasses = '';

                if (isGoodStock) {
                    badgeClasses = 'bg-green-100 text-green-800';
                    dotClasses = 'bg-green-400';
                } else if (isLowStock) {
                    badgeClasses = 'bg-red-100 text-red-800';
                    dotClasses = 'bg-red-400';
                } else {
                    badgeClasses = 'bg-yellow-100 text-yellow-800';
                    dotClasses = 'bg-yellow-400';
                }

                return (
                    <div className="text-start">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotClasses}`}></div>
                            {cantidad}
                        </span>
                        {isLowStock && cantidad > 0 && (
                            <div className="text-xs text-red-600 mt-1">Stock bajo</div>
                        )}
                        {cantidad === 0 && (
                            <div className="text-xs text-red-600 mt-1">Sin stock</div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'cat_tip_nom',
            header: 'Tipo',
            cell: ({ row }) => {
                const tipoProducto = row.getValue(
                    "cat_tip_nom"
                ) as String;
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tipoProducto}
                    </span>
                );
            },
        },
        {
            accessorKey: 'pro_activo',
            header: 'Estado',
            cell: ({ row }) => {
                const tipoEstado = row.getValue('pro_activo') as number;
                const isActivo = tipoEstado === 1;

                return (
                    <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${isActivo
                            ? 'bg-[var(--success-50)] text-[var(--success-800)] border border-[var(--success-100)]'
                            : 'bg-[var(--error-50)] text-[var(--error)] border border-[var(--error-100)]'
                            }`}
                    >
                        {/* Icono */}
                        {isActivo ? (
                            <CheckCircle
                                size={14}
                                className="text-[var(--success-400)]"
                            />
                        ) : (
                            <XCircle
                                size={14}
                                className="text-[var(--error-400)]"
                            />
                        )}
                        {isActivo ? 'Activo' : 'Inactivo'}
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