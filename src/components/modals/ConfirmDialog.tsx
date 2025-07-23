import React, { useState } from 'react';
import Button from '../ui/buttons/Button';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';
import toast from 'react-hot-toast';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirmar acción',
    message = '¿Estás seguro de que deseas continuar?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger'
}) => {
    const { isMounted, isClosing, handleClose } = useAnimatedModal(isOpen, onClose);
    const [isDeleting, setIsDeleting] = useState(false);

    React.useEffect(() => {
        if (!isOpen) {
            setIsDeleting(false);
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        setIsDeleting(true);
        
        try {
            // Ejecutar la función onConfirm y esperar si es una promesa
            await Promise.resolve(onConfirm());
            
            // Si todo sale bien, mostrar éxito después de un delay
            setTimeout(() => {
                setIsDeleting(false);
                handleClose();
                toast.success("Acción confirmada correctamente");
            }, 1500);
            
        } catch (error) {
            // Si hay error, resetear estado y mostrar error inmediatamente
            setIsDeleting(false);
            
            // Extraer mensaje de error o usar uno genérico
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Ha ocurrido un error inesperado';
                
            toast.error(`Error: ${errorMessage}`);
        }
    };

    if (!isOpen && !isMounted) return null;

    return (
        <div
            className={`fixed inset-0 z-9999 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"
                } ${isClosing ? "backdrop-blur-none bg-black/0" : "backdrop-blur-sm bg-black/60"}`}
            onClick={handleClose}
        >
            <div
                className={`relative bg-[var(--white)] rounded-2xl p-6 w-[95%] max-w-md shadow-xl transition-all duration-300 ${isMounted && !isClosing
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-8"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    {/* Icono */}
                    <div className={`
                        mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 transition-all duration-500 delay-100 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }
                        ${variant === 'danger' ? 'bg-[var(--error)]' : ''}
                        ${variant === 'warning' ? 'bg-[var(--yellow-500)]' : ''}
                        ${variant === 'info' ? 'bg-[var(--violet)]' : ''}
                    `}>
                        {variant === 'danger' && (
                            <svg className="h-6 w-6 text-[var(--red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        )}
                        {variant === 'warning' && (
                            <svg className="h-6 w-6 text-[var(--yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        )}
                        {variant === 'info' && (
                            <svg className="h-6 w-6 text-[var(--violet)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>

                    {/* Título */}
                    <h3 className={`text-lg font-bold text-[var(--black)] mb-2 transition-all duration-500 delay-200 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}>
                        {title}
                    </h3>

                    {/* Mensaje */}
                    <p className={`text-sm text-[var(--gray-400)] mb-6 transition-all duration-500 delay-300 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}>
                        {message}
                    </p>

                    {/* Botones */}
                    <div className={`flex gap-3 justify-center transition-all duration-500 delay-400 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}>
                        <Button variant="outline" onClick={handleClose}>
                            {cancelText}
                        </Button>
                        <Button
                            variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'warning' : 'primary'}
                            onClick={handleConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Procesando..." : confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};