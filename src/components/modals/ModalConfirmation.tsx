"use client";

import { useAnimatedModal } from "@/hooks/useAnimatedModal";
import { useModalStore } from "@/stores/useModalStore";
import ModalShell from "./ModalShell";

interface ModalConfirmationProps {
    children: (handleClose: () => void) => React.ReactNode;
}

export default function ModalConfirmation({ children }: ModalConfirmationProps) {
    
    const modalType = useModalStore((state) => state.modalType);
    const closeModal = useModalStore((state) => state.closeModal);

    const isOpen = modalType !== null;

    const { isMounted, isClosing, handleClose } = useAnimatedModal(isOpen, closeModal);

    if (!isOpen && !isClosing) return null;

    return (
        <ModalShell
            isMounted={isMounted}
            isClosing={isClosing}
            handleClose={handleClose}
        >
            {children(handleClose)}
        </ModalShell>
    );
}
