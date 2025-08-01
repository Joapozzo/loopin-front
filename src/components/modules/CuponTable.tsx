"use client";
import React, { useState } from 'react';
import { DataTable } from '../../components/table/DataTable';
import { TableFilters } from '../../components/table/TableFilters';
import Button from '../../components/ui/buttons/Button';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { Select } from '../ui/inputs/Select';
import { useCupones } from '../../hooks/useCupones';
import { CuponView, TipoCupon, TipoCuponView, UseCuponesConfig } from '../../types/codigos';
import { CreateCuponPromocionRequest, CreateCuponPuntosRequest } from '../../types/codigos';
import { createCuponColumns } from '../CuponColumns';
import { CuponModalStep1 } from '../modals/CuponModalPaso1';
import { CuponModalStep2Productos } from '../modals/CuponModalStep2Productos';
import { CuponModalStep3Promocion, CreateCuponPromocionFormData } from '../modals/CuponModalStep3Promocion';
import { CreateCuponPuntosFormData, CuponModalStep2Puntos } from '../modals/CuponModalPaso2Puntos';
import { UpdateEstadoCuponModal } from '../modals/UpdateEstadoCuponModal';
import { Product } from '@/types/product';
import { useProductos } from '@/hooks/useProductos';
import { useToast } from '@/hooks/useToast';
import { Toaster } from 'react-hot-toast';
import { logger } from '@/utils/logger';

type CuponModalState = 'none' | 'step1' | 'step2-productos' | 'step3-promocion' | 'step2-puntos';

interface CuponTableProps extends UseCuponesConfig {
    className?: string;
    productos?: Product[];
    loadingProductos?: boolean;
    initialPageSize?: number;
}

const ESTADO_OPTIONS = [
    { value: 1, label: '🟢 Activo' },
    { value: 2, label: '🔄 Canjeado' },
    { value: 3, label: '⏰ Expirado' },
    { value: 4, label: '🔸 Agotado' },
    { value: 5, label: '⏸️ Pausado' },
    { value: 6, label: '❌ Cancelado' }
];

const getEstadoLabel = (estado: number): string => {
    const option = ESTADO_OPTIONS.find(opt => opt.value === estado);
    return option ? option.label : `Estado ${estado}`;
};

export const CuponTable: React.FC<CuponTableProps> = ({
    className,
    productos,
    loadingProductos = false,
    ...cuponesConfig
}) => {
    const {
        cuponesUnificados,
        error,
        tipoVista,
        setTipoVista,
        estadoPromocional,
        estadoPuntos,
        setEstadoPromocional,
        setEstadoPuntos,
        refreshAll,
        refreshPromocionales,
        refreshPuntos,
        tableConfig,
        setSearch,
        setPage,
        setPageSize,
        setSorting,
        createCuponPromocion,
        createCuponPuntos,
        updateEstadoCupon,
        isCreating,
        isUpdatingEstado
    } = useCupones(cuponesConfig as UseCuponesConfig);

    const {
        tableConfig: productosTable,
    } = useProductos({ mode: 'sucursal' });

    const { showToast } = useToast();

    // Estados para el flujo paso a paso
    const [currentModal, setCurrentModal] = useState<CuponModalState>('none');
    const [selectedProducto, setSelectedProducto] = useState<Product | null>(null);

    // Estados para otros modales
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCupon, setSelectedCupon] = useState<CuponView | null>(null);

    // Estados para modal de actualizar estado
    const [isUpdateEstadoModalOpen, setIsUpdateEstadoModalOpen] = useState(false);
    const [cuponToUpdateEstado, setCuponToUpdateEstado] = useState<CuponView | null>(null);

    // =================== HANDLERS DEL FLUJO PASO A PASO ===================

    const handleNuevoCupon = () => {
        setCurrentModal('step1');
        setSelectedProducto(null);
    };

    const handleSelectTipoCupon = (tipo: TipoCupon) => {
        if (tipo === 'promocion') {
            setCurrentModal('step2-productos');
        } else {
            setCurrentModal('step2-puntos');
        }
    };

    const handleBackToStep1 = () => {
        setCurrentModal('step1');
        setSelectedProducto(null);
    };

    const handleBackToStep2 = () => {
        setCurrentModal('step2-productos');
    };

    const handleSelectProducto = (producto: Product) => {
        setSelectedProducto(producto);
        setCurrentModal('step3-promocion');
    };

    const handleSubmitPromocion = async (data: CreateCuponPromocionFormData) => {
        try {
            const requestData: CreateCuponPromocionRequest = {
                pro_id: data.pro_id,
                cod_prom_publico: data.cod_prom_publico,
                cod_prom_fecha_expiracion: data.cod_prom_fecha_expiracion,
                cod_prom_uso_max: data.cod_prom_uso_max
            };

            await createCuponPromocion(requestData);
            await refreshPromocionales();

            // Cerrar modal
            setCurrentModal('none');
            setSelectedProducto(null);

            // Toast con delay para que aparezca después del modal
            showToast(
                `Cupón promocional "${data.cod_prom_publico}" creado exitosamente`,
                'success',
                400
            );

        } catch (error: any) {
            console.error('Error creating promocional:', error);
            showToast(
                error.message || 'Error al crear el cupón promocional',
                'error',
                200
            );
        }
    };

    const handleSubmitPuntos = async (data: CreateCuponPuntosFormData) => {
        try {
            const requestData: CreateCuponPuntosRequest = {
                cod_pun_publico: data.cod_pun_publico,
                cod_pun_fecha_expiracion: data.cod_pun_fecha_expiracion,
                cod_pun_uso_max: data.cod_pun_uso_max,
                cod_pun_cant: data.cod_pun_cant
            };

            await createCuponPuntos(requestData);
            await refreshPuntos();

            // Cerrar modal
            setCurrentModal('none');

            // Toast con delay para que aparezca después del modal
            showToast(
                `Cupón de puntos "${data.cod_pun_publico}" creado exitosamente`,
                'success',
                400
            );

        } catch (error: any) {
            console.error('Error creating puntos:', error);
            showToast(
                error.message || 'Error al crear el cupón de puntos',
                'error',
                200
            );
        }
    };

    const handleCloseAllModals = () => {
        setCurrentModal('none');
        setSelectedProducto(null);
    };

    // =================== HANDLERS PARA ACTUALIZAR ESTADO ===================

    const handleUpdateEstado = (cupon: CuponView) => {
        setCuponToUpdateEstado(cupon);
        setIsUpdateEstadoModalOpen(true);
    };

    const handleConfirmUpdateEstado = async (nuevoEstado: number) => {
        if (!cuponToUpdateEstado) return;

        if (!cuponToUpdateEstado.cod_id) {
            showToast(
                'No se puede actualizar el estado: falta el ID del cupón',
                'error',
                200
            );
            return;
        }

        try {
            await updateEstadoCupon(
                Number(cuponToUpdateEstado.cod_id),
                nuevoEstado,
                cuponToUpdateEstado.tipo
            );

            // Refrescar datos según el tipo
            if (cuponToUpdateEstado.tipo === 'promocional') {
                await refreshPromocionales();
            } else {
                await refreshPuntos();
            }

            // Cerrar modal
            setIsUpdateEstadoModalOpen(false);
            setCuponToUpdateEstado(null);

            // Mostrar toast de éxito
            const estadoLabel = ESTADO_OPTIONS.find(opt => opt.value === nuevoEstado)?.label || 'actualizado';
            showToast(
                `Estado del cupón "${cuponToUpdateEstado.codigo_publico}" cambiado a ${estadoLabel}`,
                'success',
                400
            );

        } catch (error: any) {
            console.error('Error updating estado:', error);
            showToast(
                error.message || 'Error al actualizar el estado del cupón',
                'error',
                200
            );
        }
    };

    const handleCloseUpdateEstadoModal = () => {
        setIsUpdateEstadoModalOpen(false);
        setCuponToUpdateEstado(null);
    };

    // =================== OTROS HANDLERS ===================

    const handleEdit = (cupon: CuponView) => {
        // Abrir modal para actualizar estado
        handleUpdateEstado(cupon);
    };

    const handleDelete = (cupon: CuponView) => {
        setSelectedCupon(cupon);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedCupon) {
            try {
                logger.log('Eliminar cupón:', selectedCupon);
                showToast('Función de eliminación en desarrollo', 'info');
                await refreshAll();
                setSelectedCupon(null);
                setIsDeleteDialogOpen(false);
            } catch (error) {
                console.error('Error deleting cupon:', error);
                showToast('Error al eliminar el cupón', 'error');
            }
        }
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedCupon(null);
    };

    const handleRefresh = () => {
        switch (tipoVista) {
            case 'promocional':
                refreshPromocionales();
                break;
            case 'puntos':
                refreshPuntos();
                break;
            default:
                refreshAll();
                break;
        }
        showToast('Datos actualizados', 'success', 100);
    };

    const handleEstadoChange = (nuevoEstado: string | number) => {
        const estado = typeof nuevoEstado === 'string' ? parseInt(nuevoEstado) : nuevoEstado;

        if (tipoVista === 'promocional') {
            setEstadoPromocional(estado);
        } else if (tipoVista === 'puntos') {
            setEstadoPuntos(estado);
        } else {
            setEstadoPromocional(estado);
            setEstadoPuntos(estado);
        }
    };

    const getEstadoActual = (): number => {
        if (tipoVista === 'promocional') {
            return estadoPromocional;
        } else if (tipoVista === 'puntos') {
            return estadoPuntos;
        } else {
            return estadoPromocional === estadoPuntos ? estadoPromocional : estadoPromocional;
        }
    };

    const columns = React.useMemo(
        () => createCuponColumns(handleEdit, handleDelete),
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
                                Gestión de Cupones
                            </h2>
                            <p className="text-sm text-[var(--violet-200)] mt-1">
                                Crea y administra cupones de promoción y puntos - {getEstadoLabel(getEstadoActual())}
                            </p>
                        </div>
                        <Button
                            onClick={handleNuevoCupon}
                            className='flex items-center'
                            disabled={isCreating}
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {isCreating ? 'Creando...' : 'Nuevo Cupón'}
                        </Button>
                    </div>

                    {/* Filtros de tipo de cupón */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex space-x-2">
                            {(['todos', 'promocional', 'puntos'] as TipoCuponView[]).map((tipo) => (
                                <button
                                    key={tipo}
                                    onClick={() => setTipoVista(tipo)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tipoVista === tipo
                                        ? 'bg-[var(--violet)] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {tipo === 'todos' && '📋 Todos'}
                                    {tipo === 'promocional' && '🎯 Promocionales'}
                                    {tipo === 'puntos' && '💰 Puntos'}
                                    {tipo !== 'todos' && (
                                        <span className="ml-1 text-xs">
                                            ({tipo === 'promocional'
                                                ? cuponesUnificados.filter(c => c.tipo === 'promocional').length
                                                : cuponesUnificados.filter(c => c.tipo === 'puntos').length
                                            })
                                        </span>
                                    )}
                                    {tipo === 'todos' && (
                                        <span className="ml-1 text-xs">({cuponesUnificados.length})</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Filtro de estado */}
                        <div className="flex items-center space-x-4">
                            <div className="w-64">
                                <Select
                                    variant="desktop"
                                    options={ESTADO_OPTIONS}
                                    value={getEstadoActual()}
                                    onCustomChange={handleEstadoChange}
                                    label="Filtrar por estado"
                                />
                            </div>

                            {tipoVista === 'todos' && estadoPromocional !== estadoPuntos && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <span>Promocionales: {getEstadoLabel(estadoPromocional)}</span>
                                    <span>•</span>
                                    <span>Puntos: {getEstadoLabel(estadoPuntos)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <TableFilters
                    searchValue={tableConfig.filters.search || ''}
                    onSearchChange={setSearch}
                    onRefresh={handleRefresh}
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-800 text-sm font-medium">Error al cargar cupones:</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
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
                        ? `No se encontraron cupones que coincidan con "${tableConfig.filters.search}"`
                        : tipoVista === 'todos'
                            ? `No hay cupones registrados con estado ${getEstadoLabel(getEstadoActual())}`
                            : `No hay cupones de tipo ${tipoVista} con estado ${getEstadoLabel(getEstadoActual())}`
                }
                className="rounded-t-none"
            />

            {/* Modales del flujo de creación */}
            <CuponModalStep1
                isOpen={currentModal === 'step1'}
                onClose={handleCloseAllModals}
                onSelectTipo={handleSelectTipoCupon}
            />

            <CuponModalStep2Productos
                isOpen={currentModal === 'step2-productos'}
                onClose={handleCloseAllModals}
                onBack={handleBackToStep1}
                onNext={handleSelectProducto}
                productos={productosTable.data}
                isLoading={loadingProductos}
            />

            <CuponModalStep3Promocion
                isOpen={currentModal === 'step3-promocion'}
                onClose={handleCloseAllModals}
                onBack={handleBackToStep2}
                onSubmit={handleSubmitPromocion}
                productoSeleccionado={selectedProducto}
                isLoading={isCreating}
            />

            <CuponModalStep2Puntos
                isOpen={currentModal === 'step2-puntos'}
                onClose={handleCloseAllModals}
                onBack={handleBackToStep1}
                onSubmit={handleSubmitPuntos}
                isLoading={isCreating}
            />

            {/* Modal para actualizar estado */}
            <UpdateEstadoCuponModal
                isOpen={isUpdateEstadoModalOpen}
                onClose={handleCloseUpdateEstadoModal}
                onConfirm={handleConfirmUpdateEstado}
                cupon={cuponToUpdateEstado}
                isLoading={isUpdatingEstado}
            />

            {/* Modal de confirmación para eliminar */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                title="Eliminar Cupón"
                message={
                    selectedCupon
                        ? `¿Estás seguro de que deseas eliminar el cupón "${selectedCupon.codigo_publico}"? Esta acción no se puede deshacer.`
                        : '¿Estás seguro de que deseas eliminar este cupón?'
                }
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />

            {/* Toast notifications */}
            <Toaster />
        </div>
    );
};