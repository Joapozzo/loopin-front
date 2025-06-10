"use client";
import React, { useState } from 'react';
import { DataTable } from '../table/DataTable'; 
import { TableFilters } from '../../components/table/TableFilters';
import Button from '../../components/ui/buttons/Button';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { useProductos, UseProductosConfig } from '../../hooks/useProductos';
import { Product, ProductoFormData } from '../../types/product';
import { ProductoFormModalContainer } from '../modals/ProductFormModal'; 
import { createProductoColumns } from '../ProductColumns'; 
import ErrorMessage from '../ui/ErrorMessage';

interface ProductoTableProps extends UseProductosConfig {
    className?: string;
}

export const ProductoTable: React.FC<ProductoTableProps> = ({
    className,
    ...productosConfig
}) => {
    const {
        tableConfig,
        setPage,
        setPageSize,
        setSorting,
        setSearch,
        createProducto,
        updateProducto,
        deleteProducto,
        refresh,
        isCreating,
        isUpdating,
        isDeleting
    } = useProductos(productosConfig);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = () => {
        setSelectedProducto(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (producto: Product) => {
        setSelectedProducto(producto);
        setIsFormModalOpen(true);
    };

    const handleDelete = (producto: Product) => {
        setSelectedProducto(producto);
        setIsDeleteDialogOpen(true);
    };

    const handleFormSubmit = async (data: ProductoFormData) => {
        try {
            setError(null);
            if (selectedProducto) {
                await updateProducto(selectedProducto.pro_id, data);
            } else {
                await createProducto(data);
            }
            setIsFormModalOpen(false);
            setSelectedProducto(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
            throw error;
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedProducto) {
            try {
                setError(null);
                await deleteProducto(selectedProducto.pro_id);
                setSelectedProducto(null);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Error al eliminar producto');
            }
        }
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedProducto(null);
        setError(null);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedProducto(null);
    };

    const columns = React.useMemo(
        () => createProductoColumns(handleEdit, handleDelete),
        []
    );

    return (
        <div className={className}>
            {/* Encabezado con filtros */}
            <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--violet)]">
                                Gestión de Productos
                            </h2>
                            <p className="text-sm text-[var(--violet-200)] mt-1">
                                Administra el catálogo de productos
                            </p>
                        </div>
                        <Button onClick={handleCreate} className='flex items-center'>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo Producto
                        </Button>
                    </div>
                </div>

                <TableFilters
                    searchValue={tableConfig.filters.search || ''}
                    onSearchChange={setSearch}
                    onRefresh={refresh}
                    placeHolder="Buscar producto..."
                />
            </div>

            {/* Mensaje de error */}
            {error && (
                <ErrorMessage error={error} />
            )}

            {/* Tabla */}
            <DataTable
                columns={columns}
                data={tableConfig.data}
                loading={tableConfig.loading}
                error={tableConfig.error}
                pagination={tableConfig.pagination}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                sorting={tableConfig.sorting}
                onSortingChange={setSorting}
                emptyMessage="No hay productos registrados"
                className="rounded-t-none"
            />

            {/* Modal de formulario */}
            <ProductoFormModalContainer
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSubmit={handleFormSubmit}
                producto={selectedProducto || undefined}
                isLoading={isCreating || isUpdating}
            />

            {/* Diálogo de confirmación para eliminar */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                title="Eliminar Producto"
                message={
                    selectedProducto
                        ? `¿Estás seguro de que deseas eliminar "${selectedProducto.pro_nom}"? Esta acción no se puede deshacer.`
                        : '¿Estás seguro de que deseas eliminar este producto?'
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};