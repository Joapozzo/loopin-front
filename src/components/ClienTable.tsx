
"use client";
import React, { useState } from 'react';
import { DataTable } from './table/DataTable';
import { TableFilters } from './table/TableFilters';
import Button from './ui/buttons/Button';
import { ConfirmDialog } from './modals/ConfirmDialog'; 
import { useClientes, UseClientesConfig } from '../hooks/useClientes';
import { ClienteCompleto, ClienteFormData } from '../types/clienteCompleto';
import { ClienteFormModalContainer } from './ClienteFormModal';
import { createClienteColumns } from './ClientColumns'; 

interface ClienteTableProps extends UseClientesConfig {
    className?: string;
}

export const ClienteTable: React.FC<ClienteTableProps> = ({
    className,
    ...clientesConfig
}) => {
    const {
        tableConfig,
        setPage,
        setPageSize,
        setSorting,
        setSearch,
        createCliente,
        updateCliente,
        deleteCliente,
        refresh,
        isCreating,
        isUpdating,
        isDeleting
    } = useClientes(clientesConfig);
    
    // Estados para modales
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<ClienteCompleto | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Manejadores de acciones
    const handleCreate = () => {
        setSelectedCliente(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (cliente: ClienteCompleto) => {
        setSelectedCliente(cliente);
        setIsFormModalOpen(true);
    };

    const handleDelete = (cliente: ClienteCompleto) => {
        setSelectedCliente(cliente);
        setIsDeleteDialogOpen(true);
    };

    const handleFormSubmit = async (data: ClienteFormData) => {
        try {
            setError(null);
            if (selectedCliente) {
                await updateCliente(selectedCliente.cli_id, data);
            } else {
                await createCliente(data);
            }
            setIsFormModalOpen(false);
            setSelectedCliente(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
            throw error;
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedCliente) {
            try {
                setError(null);
                await deleteCliente(selectedCliente.cli_id);
                setSelectedCliente(null);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Error al eliminar cliente');
            }
        }
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedCliente(null);
        setError(null);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedCliente(null);
    };

    // Crear columnas con callbacks
    const columns = React.useMemo(
        () => createClienteColumns(handleEdit, handleDelete),
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
                                Gestión de Clientes
                            </h2>
                            <p className="text-sm text-[var(--violet-200)] mt-1">
                                Administra la información de tus clientes
                            </p>
                        </div>
                        <Button onClick={handleCreate} className='flex items-center'>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo Cliente
                        </Button>
                    </div>
                </div>

                <TableFilters
                    searchValue={tableConfig.filters.search || ''}
                    onSearchChange={setSearch}
                    onRefresh={refresh}
                    placeHolder="Buscar cliente..."
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                className="text-red-400 hover:text-red-600"
                                onClick={() => setError(null)}
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
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
                emptyMessage="No hay clientes registrados"
                className="rounded-t-none"
            />

            {/* Modal de formulario */}
            <ClienteFormModalContainer
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSubmit={handleFormSubmit}
                cliente={selectedCliente || undefined}
                isLoading={isCreating || isUpdating}
            />

            {/* Diálogo de confirmación para eliminar */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                title="Eliminar Cliente"
                message={
                    selectedCliente
                        ? `¿Estás seguro de que deseas eliminar a ${selectedCliente.cli_nom} ${selectedCliente.cli_ape}? Esta acción no se puede deshacer.`
                        : '¿Estás seguro de que deseas eliminar este cliente?'
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};