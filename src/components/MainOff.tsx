"use client";
import { useModalStore } from "@/stores/useModalStore";

interface MainOffProps {
    nombre: string;
    puntos: number;
    imagen: string;
}

export default function MainOff({ nombre, puntos, imagen }: MainOffProps) {
    const openCuponModal = useModalStore((state) => state.openModal);
    return (
        <div className="w-full max-w-md h-62 rounded-xl overflow-hidden flex shadow-lg min-w-[25rem]">

            {/* Caja izquierda */}
            <div className="bg-[var(--rose)] p-4 w-1/2 flex flex-col  text-[var(--white)] gap-4">
                <span className="bg-[var(--rose-100)] text-lg px-2 py-1 rounded-full w-fit font-bold">
                    %%% OFF
                </span>
                <h2 className="text-xl font-bold">{nombre}</h2>
                <div className="bg-[var(--violet-200)] text-[var(--violet-600)] rounded-lg px-3 py-2 font-bold text-4xl flex items-center">
                    {puntos}
                    <span className="text-sm font-normal ml-1">puntos</span>
                </div>
                <button className="bg-[var(--violet)] text-[var(--white)] border-1 border-[var(--violet)] hover:bg-transparent hover:text-[var(--white)] transition-all duration-300 text-lg font-bold rounded-lg px-6 py-2 w-full mt-1"
                    onClick={() => openCuponModal("cupon")}
                >
                    Canjear
                </button>
            </div>

            {/* Caja derecha */}
            <div className="w-1/2 h-full">
                <img
                    src={imagen}
                    alt={nombre}
                    className="object-cover w-full h-full rounded-r-xl"
                />
            </div>
        </div>
    );
}
