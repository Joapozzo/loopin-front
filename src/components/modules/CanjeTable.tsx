"use client";
import React, { useState } from 'react';
import { DataTable } from '../table/DataTable';
import { TableFilters } from '../table/TableFilters';
import Button from '../ui/buttons/Button';
import { ConfirmDialog } from '../modals/ConfirmDialog';
import { useCanjes, UseCanjesConfig } from '../../hooks/useCanjes';
import { useToast } from '../../hooks/useToast';
import { CanjeUnificado, TipoHistorialCanje } from '@/types/canje';
import { CanjeModalPaso1 } from '../modals/CanjeModalPaso1';
import { CanjeModalPaso2 } from '../modals/CanjeModalPaso2';
import { createCanjeColumns } from '../CanjeColumn';
import { useRouter, useSearchParams } from 'next/navigation';

interface CanjeTableProps extends UseCanjesConfig {
    className?: string;
}

const TIPO_VISTA_OPTIONS = [
    { value: 'encargado', label: '👤 Encargado', description: 'Canjes realizados por encargado' },
    { value: 'promocion', label: '🎯 Promocionales', description: 'Canjes de cupones promocionales' },
    { value: 'puntos', label: '💰 Puntos', description: 'Canjes de cupones de puntos' },
    // { value: 'cliente', label: '📋 Cliente', description: 'Historial del cliente' }
];

export const CanjeTable: React.FC<CanjeTableProps> = ({
    className,
    ...canjesConfig
}) => {
    const [currentTipoVista, setCurrentTipoVista] = useState<TipoHistorialCanje>("encargado");

    const {
        tableConfig,
        tipoVista,
        setTipoVista,
        estadisticas,
        setPage,
        setPageSize,
        setSorting,
        setSearch,
        refreshAll,

        // Funciones de validación
        validarCodigoCliente,
        validarCodigoPromocion,
        resetValidaciones,

        // Estados de validación
        isValidando,
        errorValidacionCliente,
        errorValidacionPromocion,
        datosValidacionCliente,
        datosValidacionPromocion,

        // Funciones de canje
        canjearCodigoCliente,
        canjearCodigoPromocion,
        canjearCodigoPuntos,

        // Estados de canje
        isCanjeing,

        error: hookError,
    } = useCanjes({
        ...canjesConfig,
        tipoVista: currentTipoVista
    });

    const { showToast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Estados para modales
    const [isPaso1Open, setIsPaso1Open] = useState(false);
    const [isPaso2Open, setIsPaso2Open] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCanje, setSelectedCanje] = useState<CanjeUnificado | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Datos del formulario paso 1
    const [formDataPaso1, setFormDataPaso1] = useState<{
        codigo: string;
        dni: string;
        nroTicket: string;
    } | null>(null);

    const handleNuevoCanje = () => {
        // Limpiar estados previos
        resetValidaciones();
        setFormDataPaso1(null);
        setError(null);
        setIsPaso1Open(true);
    };

    const handleDelete = (canje: CanjeUnificado) => {
        setSelectedCanje(canje);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedCanje) {
            try {
                setError(null);
                // TODO: Implementar eliminación cuando esté disponible en el servicio
                console.log('Eliminar canje:', selectedCanje);
                showToast('Funcionalidad de anulación en desarrollo', 'info');
                setSelectedCanje(null);
                setIsDeleteDialogOpen(false);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al anular canje';
                setError(errorMessage);
                showToast(errorMessage, 'error');
            }
        }
    };

    const handleClosePaso1 = () => {
        setIsPaso1Open(false);
        setError(null);
        resetValidaciones();
        setFormDataPaso1(null);
    };

    const handleClosePaso2 = () => {
        setIsPaso2Open(false);
        setError(null);
        resetValidaciones();
        setFormDataPaso1(null);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedCanje(null);
    };

    const handleRefresh = () => {
        refreshAll();
        showToast('Datos actualizados correctamente', 'success');
    };

    // Handler para el paso 1 - Validación
    const handlePaso1Submit = async (data: { codigo: string; dni: string; nroTicket: string }) => {
        try {
            setError(null);
            setFormDataPaso1(data);

            // Intentar ambas validaciones - una tendrá éxito y la otra fallará
            let validacionExitosa = false;
            let tipoValidacion: 'cliente' | 'promocion' | null = null;

            try {
                await validarCodigoCliente(data.codigo, data.dni);
                validacionExitosa = true;
                tipoValidacion = 'cliente';
                showToast('Código de cliente validado correctamente', 'success');
            } catch (errorCliente) {
                // Intentar con código promocional
                try {
                    await validarCodigoPromocion(data.codigo, data.dni);
                    validacionExitosa = true;
                    tipoValidacion = 'promocion';
                    showToast('Código promocional validado correctamente', 'success');
                } catch (errorPromocion) {
                    // Ambas validaciones fallaron
                    const mensajeError = `Código no válido. Verifique el código y DNI ingresados.`;
                    setError(mensajeError);
                    showToast(mensajeError, 'error');
                    return;
                }
            }

            if (validacionExitosa) {
                // Cerrar paso 1 y abrir paso 2
                setIsPaso1Open(false);
                setIsPaso2Open(true);
                showToast(`Validación exitosa. Confirme los datos para proceder con el canje.`, 'info');
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error durante la validación';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        }
    };

    // Handler para el paso 2 - Confirmar canje
    const handlePaso2Confirmar = async () => {
        if (!formDataPaso1) {
            showToast('Error: No hay datos de validación disponibles', 'error');
            return;
        }

        try {
            setError(null);

            // Determinar qué tipo de canje realizar basado en qué validación fue exitosa
            if (datosValidacionCliente) {
                await canjearCodigoCliente({
                    usu_dni: formDataPaso1.dni,
                    cod_publico: formDataPaso1.codigo,
                    cod_nro_ticket: formDataPaso1.nroTicket
                });
                showToast('Código de cliente canjeado exitosamente', 'success');
            } else if (datosValidacionPromocion) {
                await canjearCodigoPromocion({
                    usu_dni: formDataPaso1.dni,
                    cod_publico: formDataPaso1.codigo,
                    cod_nro_ticket: formDataPaso1.nroTicket
                });
                showToast('Código promocional canjeado exitosamente', 'success');
            } else {
                throw new Error('No hay datos de validación disponibles');
            }

            // Cerrar modal y limpiar estados
            handleClosePaso2();

            // Actualizar datos después de un breve delay para que el usuario vea el cambio
            setTimeout(() => {
                refreshAll();
            }, 500);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al procesar el canje';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        }
    };

    const getTipoVistaLabel = (tipo: TipoHistorialCanje): string => {
        const option = TIPO_VISTA_OPTIONS.find(opt => opt.value === tipo);
        return option ? option.label : tipo;
    };

    const columns = React.useMemo(
        () => createCanjeColumns(handleDelete),
        []
    );

    React.useEffect(() => {
        const shouldOpenModal = searchParams.get('modal') === 'nuevo-canje';
        if (shouldOpenModal) {
            setIsPaso1Open(true);

            router.replace('/res/canjes');
        }
    }, [searchParams, router]);

    // Determinar qué datos de validación mostrar en el paso 2
    const validacionParaPaso2 = datosValidacionCliente || datosValidacionPromocion;

    return (
        <div className={className}>
            {/* Encabezado con filtros */}
            <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--violet)]">
                                Gestión de Canjes
                            </h2>
                            <p className="text-sm text-[var(--violet-200)] mt-1">
                                Administra los canjes de productos y promociones - {getTipoVistaLabel(tipoVista)}
                            </p>
                        </div>
                        <Button
                            onClick={handleNuevoCanje}
                            className='flex items-center'
                            disabled={isCanjeing || isValidando}
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {isCanjeing ? 'Canjeando...' : isValidando ? 'Validando...' : 'Nuevo Canje'}
                        </Button>
                    </div>

                    {/* Filtros de tipo de vista */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {TIPO_VISTA_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setTipoVista(option.value as TipoHistorialCanje)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tipoVista === option.value
                                        ? 'bg-[var(--violet)] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    title={option.description}
                                >
                                    {option.label}
                                    {tipoVista === option.value && (
                                        <span className="ml-1 text-xs">
                                            ({estadisticas[`canjes${option.value.charAt(0).toUpperCase() + option.value.slice(1)}` as keyof typeof estadisticas] || 0})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Estadísticas rápidas */}
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <span className="font-medium">Total:</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">{estadisticas.totalCanjes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="font-medium">Encargado:</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{estadisticas.canjesEncargado}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="font-medium">Promocionales:</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{estadisticas.canjesPromocion}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="font-medium">Puntos:</span>
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{estadisticas.canjesPuntos}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <TableFilters
                    searchValue={tableConfig.filters.search || ''}
                    onSearchChange={setSearch}
                    onRefresh={handleRefresh}
                />
            </div>

            {/* Mensaje de error del hook */}
            {hookError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-800 text-sm font-medium">Error al cargar canjes:</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">{hookError}</p>
                </div>
            )}

            {/* Mensaje de error local */}
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

            {/* Indicador de validación */}
            {isValidando && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-blue-800 text-sm font-medium">Validando código...</span>
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
                emptyMessage={
                    tableConfig.filters.search?.trim()
                        ? `No se encontraron canjes que coincidan con "${tableConfig.filters.search}"`
                        : `No hay canjes de tipo ${getTipoVistaLabel(tipoVista)} registrados`
                }
                className="rounded-t-none"
            />

            {/* Modal Paso 1 - Validar Código */}
            <CanjeModalPaso1
                isOpen={isPaso1Open}
                onClose={handleClosePaso1}
                onSubmit={handlePaso1Submit}
                isLoading={isValidando}
                error={error}
            />

            {/* Modal Paso 2 - Confirmar Canje */}
            <CanjeModalPaso2
                isOpen={isPaso2Open}
                onClose={handleClosePaso2}
                onConfirmar={handlePaso2Confirmar}
                validacion={validacionParaPaso2}
                isLoading={isCanjeing}
                error={error}
            />

            {/* Diálogo de confirmación para anular */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                title="Anular Canje"
                message={
                    selectedCanje
                        ? `¿Estás seguro de que deseas anular el canje ${selectedCanje.nro_ticket || selectedCanje.codigo_publico}? Esta acción no se puede deshacer.`
                        : '¿Estás seguro de que deseas anular este canje?'
                }
                confirmText="Anular"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};