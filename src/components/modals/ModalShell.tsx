import { ReactNode } from "react";

interface ModalShellProps {
    children: ReactNode;
    isMounted: boolean;
    isClosing: boolean;
    handleClose: () => void;
}

export default function ModalShell({ children, isMounted, isClosing, handleClose }: ModalShellProps) {
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
                isMounted ? "opacity-100" : "opacity-0"
            } ${
                isClosing
                    ? "backdrop-blur-none bg-black/0"
                    : "backdrop-blur-sm bg-black/60"
            }`}
            onClick={handleClose}
        >
            <div
                className={`relative bg-[var(--violet-50)] text-gray-800 rounded-2xl p-6 w-[90%] max-w-sm shadow-xl transition-all duration-300 ${
                    isMounted && !isClosing
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-8"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
