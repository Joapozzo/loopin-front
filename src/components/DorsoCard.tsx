import { Eye } from "lucide-react";

interface DorsoCardProps {
    clientNombre: string;
    dni: string;
    codigo: number;
    fechaAlta: string;
    onToggle: () => void;
    isVisible: boolean;
    isFlipping: boolean;
    puntos?: number;
}

export default function DorsoCard({
    clientNombre,
    dni,
    codigo,
    fechaAlta,
    onToggle,
    isVisible,
    isFlipping,
    puntos
}: DorsoCardProps) {
    return (
        <div
            className={`absolute inset-0 bg-[var(--black)] py-4 px-8 rounded-lg flex flex-col gap-4 items-start justify-center transition-all duration-500 ${isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            style={{
                transform: isVisible ? 'rotateY(0deg)' : 'rotateY(180deg)',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
            }}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex flex-col items-start justify-center">
                    <p className="text-xl font-semibold">{clientNombre}</p>
                    <p className="text-md text-[var(--foreground)]">{dni}</p>
                </div>
                <button
                    onClick={onToggle}
                    className="hover:bg-gray-800 p-2 rounded-full transition-colors card-button"
                    disabled={isFlipping}
                    style={{
                        position: 'relative',
                        zIndex: 30
                    }}
                >
                    <Eye className="opacity-60" />
                </button>
            </div>
            <span className="flex items-center gap-1 text-[var(--white)]">
                <h3 className="text-4xl font-bold">{puntos}</h3>
                <p>{puntos == 1 ? "punto" : "puntos"}</p>
            </span>
            <div className="flex flex-col items-end justify-center w-full">
                <p className="text-md font-semibold">Fecha de alta</p>
                <p className="text-sm text-[var(--foreground)]">{fechaAlta}</p>
            </div>
        </div>
    );
}