import React, { useState } from 'react';
import Button from '../ui/buttons/Button';
import { CheckCircle, XCircle, Gift, Star, User, Package, Calendar, Shield } from 'lucide-react';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';
import { ValidarCodigoClienteResponse, ValidarCodigoPromocionResponse } from '@/types/canje';
import SpinnerLoader from '../ui/SpinerLoader';

interface CanjeModalPaso2Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirmar: () => Promise<void>;
    validacion: ValidarCodigoClienteResponse | ValidarCodigoPromocionResponse | null;
    isLoading?: boolean;
    error?: string | null;
}

export const CanjeModalPaso2: React.FC<CanjeModalPaso2Props> = ({
    isOpen,
    onClose,
    onConfirmar,
    validacion,
    isLoading = false,
    error = null
}) => {
    const { isMounted, isClosing, handleClose } = useAnimatedModal(isOpen, onClose);
    const [submitError, setSubmitError] = useState<string | null>(null);

    if (!validacion) return null;

    const handleConfirmar = async () => {
        try {
            setSubmitError(null);
            await onConfirmar();
        } catch (error: any) {
            // Manejar errores específicos del servidor
            let errorMessage = 'Error al confirmar el canje';

            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.detail) {
                errorMessage = error.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setSubmitError(errorMessage);
            console.error('Error al confirmar canje:', error);
        }
    };

    const handleCloseModal = () => {
        setSubmitError(null);
        handleClose();
    };

    if (!isOpen && !isMounted) return null;

    // Determinar tipo de validación
    const esCodigoCliente = 'codigo_cliente' in validacion;
    const esCodigoPromocion = 'codigo_promocional' in validacion;

    // Extraer datos según el tipo
    const datosCliente = esCodigoCliente
        ? (validacion as ValidarCodigoClienteResponse).codigo_cliente
        : (validacion as ValidarCodigoPromocionResponse).cliente;

    const datosProducto = esCodigoCliente
        ? (validacion as ValidarCodigoClienteResponse).codigo_cliente.pro_nom
        : (validacion as ValidarCodigoPromocionResponse).codigo_promocional.pro_nom;

    const datosCodigo = esCodigoPromocion
        ? (validacion as ValidarCodigoPromocionResponse).codigo_promocional
        : null;

    // Usar el error del prop o el error local, priorizando el del prop
    const displayError = error || submitError;

    return (
        <div
            className={`fixed inset-0 z-9998 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"
                } ${isClosing
                    ? "backdrop-blur-none bg-black/0"
                    : "backdrop-blur-sm bg-black/60"
                }`}
            onClick={handleCloseModal}
        >
            <div
                className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-300 ${isMounted && !isClosing
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-8"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between mb-6 transition-all duration-500 delay-100 ${isMounted && !isClosing
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-4"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-green-200 text-green-800 p-2 rounded-lg">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <span className="bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg font-bold text-sm">
                                PASO 2
                            </span>
                            <h2 className="text-2xl font-bold mt-1">Confirmar Canje</h2>
                            <p className="text-[var(--violet-200)] text-sm mt-1">
                                {esCodigoCliente ? "Canje por Puntos" : "Canje Promocional"}
                            </p>
                        </div>
                    </div>

                    <button
                        className="text-[var(--white)] hover:scale-110 transition-transform active:scale-90 p-2"
                        onClick={handleCloseModal}
                        disabled={isLoading}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Error Message */}
                {displayError && (
                    <div
                        className={`mb-6 p-4 rounded-lg bg-red-100 border border-red-300 transition-all duration-500 delay-150 ${isMounted && !isClosing
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-4"
                            }`}
                    >
                        <div className="flex items-center text-red-800">
                            <svg
                                className="w-5 h-5 mr-2 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <span className="font-medium">
                                    Error al procesar el canje
                                </span>
                                <p className="text-sm mt-1">{displayError}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success State - Confirmation */}
                <div className="space-y-6">
                    {/* Mensaje de validación exitosa */}
                    <div
                        className={`bg-green-100 border border-green-300 rounded-lg p-4 transition-all duration-500 delay-200 ${isMounted && !isClosing
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-4"
                            }`}
                    >
                        <div className="flex items-center text-green-800">
                            <CheckCircle size={20} className="mr-3" />
                            <div>
                                <span className="font-medium">✅ Validación exitosa</span>
                                <p className="text-sm mt-1">{validacion.mensaje}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Datos del Cliente */}
                        <div
                            className={`transition-all duration-500 delay-250 ${isMounted && !isClosing
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-4"
                                }`}
                        >
                            <div className="flex items-center gap-2 border-b border-[var(--violet-300)] pb-3 mb-4">
                                <User size={20} className="text-[var(--violet-200)]" />
                                <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                    Datos del Cliente
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-[var(--violet-600)] rounded-lg p-4 border border-[var(--violet-300)]  min-h-[110px] flex items-center">
                                    <div className="flex items-center gap-3">
                                        <User size={40} className="text-[var(--violet-200)]" />
                                        <div>
                                            <h4 className="font-bold text-lg">
                                                {datosCliente.cli_nom} {datosCliente.cli_ape}
                                            </h4>
                                            <p className="text-[var(--violet-50)]">
                                                DNI: {datosCliente.cli_dni}
                                            </p>
                                            <p className="text-[var(--violet-50)] text-sm">
                                                <Calendar size={14} className="inline mr-1" />
                                                Nacimiento:{" "}
                                                {new Date(
                                                    datosCliente.cli_fec_nac
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* {esCodigoCliente && (
                                    <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star size={20} className="text-blue-600" />
                                            <span className="font-medium text-blue-800">
                                                Estado del Código
                                            </span>
                                        </div>
                                        <p className="text-blue-700 text-sm">
                                            <Shield size={14} className="inline mr-1" />
                                            {(datosCliente as any).est_cod_nom}
                                        </p>
                                    </div>
                                )} */}
                            </div>
                        </div>

                        {/* Datos del Producto/Promoción */}
                        <div
                            className={`transition-all duration-500 delay-300 ${isMounted && !isClosing
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-4"
                                }`}
                        >
                            <div className="flex items-center gap-2 border-b border-[var(--violet-300)] pb-3 mb-4">
                                <Package size={20} className="text-[var(--violet-200)]" />
                                <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                    {esCodigoPromocion ? "Promoción" : "Producto a Canjear"}
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-[var(--violet-600)] rounded-lg p-4 border border-[var(--violet-300)] min-h-[110px] flex items-center">
                                    <div className="flex items-center gap-3">
                                        <Package size={40} className="text-[var(--violet-200)]" />
                                        <div>
                                            <h4 className="font-bold text-lg">{datosProducto}</h4>
                                            <p className="text-[var(--violet-50)]">
                                                {esCodigoPromocion
                                                    ? "Promoción Especial"
                                                    : "Canje por Puntos"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {esCodigoPromocion && datosCodigo && (
                                    <div className="space-y-3">
                                        <div className="bg-purple-100 border border-purple-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Gift size={20} className="text-purple-600" />
                                                <span className="font-bold text-purple-800">
                                                    Código Promocional
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm text-purple-700">
                                                <p>
                                                    <strong>Código:</strong>{" "}
                                                    {datosCodigo.cod_prom_publico}
                                                </p>
                                                <p>
                                                    <strong>Emisión:</strong>{" "}
                                                    {new Date(
                                                        datosCodigo.cod_prom_fecha_emision
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p>
                                                    <strong>Uso máximo:</strong>{" "}
                                                    {datosCodigo.cod_prom_uso_max} veces
                                                </p>
                                                <p>
                                                    <strong>Estado:</strong> {datosCodigo.est_cod_nom}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* {esCodigoCliente && (
                                    <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield size={20} className="text-green-600" />
                                            <span className="font-bold text-green-800">
                                                Estado del Código
                                            </span>
                                        </div>
                                        <p className="text-green-700 text-sm">
                                            {(datosCliente as any).est_cod_nom}
                                        </p>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div
                        className={`bg-[var(--violet-600)] rounded-lg p-4 border border-[var(--violet-300)] transition-all duration-500 delay-350 ${isMounted && !isClosing
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-4"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="text-[var(--violet-200)]">
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="text-sm text-[var(--violet-100)]">
                                <p className="font-medium mb-1">⚠️ Confirmar Canje:</p>
                                <p className="text-xs">
                                    Una vez confirmado, el canje se procesará inmediatamente y
                                    no podrá deshacerse. Asegúrese de que todos los datos sean
                                    correctos antes de proceder.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div
                        className={`flex justify-end space-x-4 pt-6 border-t border-[var(--violet-300)] transition-all duration-500 delay-400 ${isMounted && !isClosing
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-4"
                            }`}
                    >
                        <Button
                            variant="outline"
                            onClick={handleCloseModal}
                            disabled={isLoading}
                            className="border-[var(--violet-300)] text-[var(--violet-200)] hover:bg-[var(--violet-600)] hover:border-[var(--violet-200)] hover:text-white"
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={handleConfirmar}
                            variant="light"
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <SpinnerLoader/>
                                    Confirmando...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    Confirmar Canje
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};