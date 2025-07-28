"use client";
import React, { useState } from 'react';
import { DataTable } from '../table/DataTable';
import { TableFilters } from '../../components/table/TableFilters';
import Button from '../../components/ui/buttons/Button';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { useProductos, UseProductosConfig, ProductoUpdateData } from '../../hooks/useProductos';
import { Product, ProductoFormData } from '../../types/product';
import { ProductoFormModalContainer } from '../modals/ProductFormModal';
import { createProductoColumns } from '../ProductColumns';
import ErrorMessage from '../ui/ErrorMessage';
import { useCategorias } from '@/hooks/useCategoria';
import { useComercioData } from '@/hooks/useComercioEncargado';
import { logger } from '@/utils/logger';

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
    } = useProductos({ mode: 'sucursal', ...productosConfig });

    const { comercioData } = useComercioData();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { categorias, isLoading } = useCategorias();

    const handleCreate = () => {
        logger.log('🆕 Iniciando creación de producto');
        setSelectedProducto(null);
        setError(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (producto: Product) => {
        logger.log('✏️ Iniciando edición de producto:', producto);
        setSelectedProducto(producto);
        setError(null);
        setIsFormModalOpen(true);
    };

    const handleDelete = (producto: Product) => {
        setSelectedProducto(producto);
        setIsDeleteDialogOpen(true);
    };
    const handleFormSubmit = async (data: any) => {
        try {
            setError(null);

            if (!selectedProducto) {
                await createProducto(data);

            } else {
                // PARA EDITAR: data tiene estructura { data: {...}, foto: ... }
                logger.log('Updating product with object:', data);

                if (!data.data || !data.data.pro_nom || !data.data.pro_puntos_canje ||
                    data.data.pro_cantidad_disp === undefined || !data.data.cat_tip_id ||
                    !data.data.pro_tip_id || !data.data.pro_tyc) {
                    throw new Error('Faltan campos obligatorios para la actualización');
                }

                const proActivo = data.data.pro_activo === 1 ? true : false;
                const updateData: ProductoUpdateData = {
                    data: {
                        pro_nom: data.data.pro_nom,
                        pro_puntos_canje: data.data.pro_puntos_canje,
                        pro_cantidad_disp: data.data.pro_cantidad_disp,
                        cat_tip_id: data.data.cat_tip_id,
                        pro_tip_id: data.data.pro_tip_id,
                        pro_tyc: data.data.pro_tyc,
                        pro_activo: proActivo,
                    },
                    foto: data.foto
                };

                await updateProducto(selectedProducto.pro_id, updateData);
            }

            setIsFormModalOpen(false);
            setSelectedProducto(null);
            logger.log('✅ Operación completada exitosamente');

        } catch (error) {
            logger.error('❌ Error en handleFormSubmit:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(errorMessage);
            throw error;
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedProducto) {
            try {
                setError(null);
                logger.log('🗑️ Eliminando producto:', selectedProducto.pro_id);
                await deleteProducto(selectedProducto.pro_id);
                setSelectedProducto(null);
                setIsDeleteDialogOpen(false);
                logger.log('✅ Producto eliminado exitosamente');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al eliminar producto';
                logger.error('❌ Error eliminando producto:', errorMessage);
                setError(errorMessage);
            }
        }
    };

    const handleCloseFormModal = () => {
        logger.log('🚪 Cerrando modal');
        setIsFormModalOpen(false);
        setSelectedProducto(null);
        setError(null);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedProducto(null);
    };

    const columns = React.useMemo(
        () => createProductoColumns(handleEdit, handleDelete, categorias),
        [handleEdit, handleDelete, categorias]
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
                                Administra el catálogo de productos de tu sucursal
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
                emptyMessage="No hay productos registrados en esta sucursal"
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
            // isLoading={isDeleting}
            />
        </div>
    );
};