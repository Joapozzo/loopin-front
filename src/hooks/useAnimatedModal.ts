import { useEffect, useState } from "react";

export function useAnimatedModal(isOpen: boolean, onClose: () => void) {
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Montamos el modal primero
            setIsMounted(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsMounted(false);
            setIsClosing(false);
            onClose();
        }, 300); // duración de la animación de salida
    };

    return { isMounted, isClosing, handleClose };
}
