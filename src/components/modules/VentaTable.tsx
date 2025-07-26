"use client";
import React, { useState } from 'react';
import { DataTable } from '../table/DataTable';
import { TableFilters } from '../table/TableFilters';
import Button from '../ui/buttons/Button';
import { useVentas, UseVentasConfig } from '../../hooks/useVentas';
import { CompraFormData } from '../../types/venta';
import { VentaFormModalContainer } from '../modals/VentaFormModal';
import { createCompraColumns } from '../VentaColumns';
import { Toaster } from 'react-hot-toast';
import { useToast } from '@/hooks/useToast';
import { useRouter, useSearchParams } from 'next/navigation';

interface VentaTableProps extends UseVentasConfig {
    className?: string;
}

export const VentaTable: React.FC<VentaTableProps> = ({
    className,
    ...ventasConfig
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { compras, loading, error: hookError, createVenta, refresh, isCreating, comprasTotales, setSearch } = useVentas(ventasConfig);
    const { showToast } = useToast();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const handleCreate = () => {
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = async (data: CompraFormData) => {
        try {
            const result = await createVenta(data);
            setIsFormModalOpen(false);

            // Toast de éxito con delay para que aparezca después del modal
            showToast(
                result.mensaje || 'Compra registrada correctamente',
                'success',
                400
            );

            return result;
        } catch (error: any) {
            // Toast de error
            let errorMessage = 'Error al registrar la compra';

            if (error.detail) {
                errorMessage = error.detail;
            } else if (error.data?.detail) {
                errorMessage = error.data.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }

            showToast(errorMessage, 'error', 200);
            throw error;
        }
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
    };

    const handleRefresh = async () => {
        try {
            await refresh();
            showToast('Datos actualizados', 'success', 100);
        } catch (error) {
            showToast('Error al actualizar datos', 'error', 100);
        }
    };

    const columns = React.useMemo(
        () => createCompraColumns(),
        []
    );

    React.useEffect(() => {
        const shouldOpenModal = searchParams.get('modal') === 'nueva-venta';
        if (shouldOpenModal) {
            setIsFormModalOpen(true);

            router.replace('/res/ventas');
        }
    }, [searchParams, router]);

    // Error del hook solamente
    const displayError = hookError;

    return (
        <div className={className}>
            {/* Encabezado */}
            <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--violet)]">
                                Historial de Ventas
                            </h2>
                            <p className="text-sm text-[var(--violet-200)] mt-1">
                                Administra las ventas y otorgamiento de puntos
                                {comprasTotales > 0 && (
                                    <span className="ml-2 text-[var(--violet)]">
                                        ({comprasTotales} compras registradas)
                                    </span>
                                )}
                            </p>
                        </div>
                        <Button onClick={handleCreate} className='flex items-center'>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Registrar venta
                        </Button>
                    </div>
                </div>

                <TableFilters
                    searchValue=""
                    onSearchChange={setSearch}
                    onRefresh={handleRefresh}
                />
            </div>

            {/* Mensaje de error */}
            {displayError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{displayError}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla */}
            <DataTable
                columns={columns}
                data={compras}
                loading={loading}
                error={hookError}
                pagination={{
                    page: 1,
                    limit: compras.length,
                    total: comprasTotales,
                    totalPages: 1
                }}
                onPageChange={() => { }} // Sin paginación por ahora
                onPageSizeChange={() => { }} // Sin paginación por ahora
                sorting={{}}
                onSortingChange={() => { }} // Sin sorting por ahora
                emptyMessage="No hay compras registradas"
                className="rounded-t-none"
            />

            {/* Modal de formulario */}
            <VentaFormModalContainer
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSubmit={handleFormSubmit}
                isLoading={isCreating}
            />

            {/* Toast notifications */}
            <Toaster />
        </div>
    );
};