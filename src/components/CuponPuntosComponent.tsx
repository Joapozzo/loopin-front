"use client";
import { useState } from 'react';
import { useCanjes } from '@/hooks/useCanjes';
import { useModalStore } from '@/stores/useModalStore';
import Button from '@/components/ui/buttons/Button';
import Input from './ui/inputs/Input';
import { useAnimatedModal } from "@/hooks/useAnimatedModal";
import { X, Gift, CheckCircle, AlertCircle, Award } from 'lucide-react';

interface CanjeSuccessResponse {
    mensaje: string;
    puntos_asignados: number;
    sucursal: string;
}

const CuponPuntosModal = () => {
    const [codigo, setCodigo] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState<CanjeSuccessResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    
    // Usar el store para controlar el modal
    const isModalOpen = useModalStore((state) => state.modalType === "cupon-puntos");
    const closeModal = useModalStore((state) => state.closeModal);
    
    const { isMounted, isClosing, handleClose } = useAnimatedModal(isModalOpen, () => {
        setCodigo('');
        setErrorMessage('');
        setShowSuccess(false);
        setSuccessData(null);
        closeModal();
    });

    const { canjearCodigoPuntos, isCanjeandoPuntos } = useCanjes({
        enabled: true,
        tipoVista: 'cliente'
    });

    const handleCloseModal = () => {
        handleClose();
        setCodigo('');
        setErrorMessage('');
        setShowSuccess(false);
        setSuccessData(null);
    };

    const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
        e?.preventDefault();
        
        if (!codigo.trim()) {
            setErrorMessage('Por favor ingresa el código del cupón');
            return;
        }

        try {
            const response = await canjearCodigoPuntos({
                cod_pun_publico: codigo.trim()
            });
            
            setSuccessData(response.data);
            setShowSuccess(true);
            setErrorMessage('');
        } catch (error: any) {
            const errorMsg = error.detail || error.message || 'Error al canjear el cupón';
            setErrorMessage(errorMsg);
            setShowSuccess(false);
        }
    };

    // Si el modal no está abierto, no renderizar nada
    if (!isModalOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-999 flex items-center justify-center transition-all duration-300 ${
                isMounted ? "opacity-100" : "opacity-0"
            } ${
                isClosing
                    ? "backdrop-blur-none bg-black/0"
                    : "backdrop-blur-sm bg-black/60"
            }`}
            onClick={handleCloseModal}
        >
            <div
                className={`relative bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-xl transition-all duration-300 ${
                    isMounted && !isClosing
                        ? "scale-100 translate-y-0"
                        : "scale-95 translate-y-4"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón cerrar */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:scale-110 transition-transform active:scale-90"
                    onClick={handleCloseModal}
                >
                    <X size={24} className="hover:rotate-90 transition-transform duration-200" />
                </button>

                {/* Contenido del modal */}
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mx-auto mb-4">
                            <Gift className="text-violet-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Canjear Cupón de Puntos
                        </h2>
                        <p className="text-gray-600">
                            Ingresa tu código para sumar puntos a tu tarjeta
                        </p>
                    </div>

                    {/* Formulario */}
                    {!showSuccess ? (
                        <div className="space-y-4">
                            <Input
                                label="Código del cupón"
                                placeholder="Ej: ABC123XYZ"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                                error={errorMessage && !codigo.trim() ? 'Campo requerido' : ''}
                                disabled={isCanjeandoPuntos}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />

                            {/* Error general */}
                            {errorMessage && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                                    <p className="text-red-700 text-sm">{errorMessage}</p>
                                </div>
                            )}

                            {/* Botones */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleCloseModal}
                                    className="flex-1"
                                    disabled={isCanjeandoPuntos}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    className="flex-1"
                                    disabled={isCanjeandoPuntos || !codigo.trim()}
                                >
                                    {isCanjeandoPuntos ? 'Canjeando...' : 'Canjear Cupón'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* Mensaje de éxito con detalles */
                        <div className="text-center py-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                ¡Cupón canjeado exitosamente!
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {successData?.mensaje || 'Puntos agregados a tu tarjeta'}
                            </p>

                            {/* Detalles del canje */}
                            <div className="space-y-3">
                                {successData?.puntos_asignados && (
                                    <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <Award className="text-green-600" size={20} />
                                        <span className="text-green-700 font-bold text-lg">
                                            +{successData.puntos_asignados} puntos
                                        </span>
                                    </div>
                                )}
                                {successData?.sucursal && (
                                    <div className="p-3 bg-[var(--violet-50)] border border-[var(--violet-200)] rounded-lg">
                                        <p className="text-[var(--violet)] text-sm">
                                            <span className="font-medium">Sucursal:</span> {successData.sucursal}
                                        </p>
                                    </div>
                                )}
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-gray-700 text-sm">
                                        <span className="font-medium">Código:</span> {codigo}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CuponPuntosModal;