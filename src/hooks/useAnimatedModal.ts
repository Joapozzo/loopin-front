import { useEffect, useState } from "react";

export function useAnimatedModal(isOpen: boolean, onClose: () => void) {
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            setIsClosing(false);
        } else if (isMounted && !isClosing) {
            // Iniciar animación de cierre cuando isOpen se vuelve false
            setIsClosing(true);
            setTimeout(() => {
                setIsMounted(false);
                setIsClosing(false);
            }, 300);
        }
    }, [isOpen, isMounted, isClosing]);

    const handleClose = () => {
        if (!isClosing) {
            onClose(); // Esto hará que isOpen se vuelva false, activando el useEffect
        }
    };

    return { isMounted, isClosing, handleClose };
}