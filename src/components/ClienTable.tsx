"use client";
import React, { useState } from 'react';
import { DataTable } from './table/DataTable';
import { TableFilters } from './table/TableFilters';
import { useClientes, UseClientesConfig } from '../hooks/useClientes';
import { createClienteColumns } from './ClientColumns'; 

interface ClienteTableProps extends UseClientesConfig {
    className?: string;
}

export const ClienteTable: React.FC<ClienteTableProps> = ({
    className,
    ...clientesConfig
}) => {
    const [mostrarActivos, setMostrarActivos] = useState(true);
    
    const {
        tableConfig,
        setPage,
        setPageSize,
        setSorting,
        setSearch,
        refresh
    } = useClientes({ ...clientesConfig, activos: mostrarActivos });

    // Crear columnas sin callbacks de edición/eliminación (solo lectura)
    const columns = React.useMemo(
        () => createClienteColumns(),
        []
    );

    return (
        <div className={className}>
            {/* Encabezado con filtros */}
            <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--violet)]">
                                Gestión de Clientes
                            </h2>
                            <p className="text-sm text-[var(--violet-200)] mt-1">
                                Consulta la información de tus clientes {mostrarActivos ? 'activos' : 'inactivos'}
                            </p>
                        </div>
                    </div>

                    {/* Filtros de estado de clientes */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setMostrarActivos(true)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mostrarActivos
                                ? 'bg-[var(--violet)] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            🟢 Activos
                        </button>
                        <button
                            onClick={() => setMostrarActivos(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!mostrarActivos
                                ? 'bg-[var(--violet)] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            🔴 Inactivos
                        </button>
                    </div>
                </div>

                <TableFilters
                    searchValue={tableConfig.filters.search || ''}
                    onSearchChange={setSearch}
                    onRefresh={refresh}
                    placeHolder="Buscar cliente..."
                />
            </div>

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
        </div>
    );
};