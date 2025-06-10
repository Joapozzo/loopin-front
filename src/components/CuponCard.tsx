"use client";
import { useProductById } from "@/hooks/useProductById";
import { useRestaurantById } from "@/hooks/useRestaurantById";
import { useCodigosStore } from "@/stores/codigosStore";
import { useModalStore } from "@/stores/useModalStore";
import { Codigo } from "@/types/codigo";
import { Hand } from "lucide-react";

interface CuponCardProps {
    codigo: Codigo;
}

export default function CuponCard({ codigo }: CuponCardProps) {
    const setCodigoSeleccionado = useCodigosStore((state) => state.setCodigoSeleccionado);
    const openCuponModal = useModalStore((state) => state.openModal);

    const { product } = useProductById(+codigo.pro_id);
    const { restaurant } = useRestaurantById(+codigo.res_id);

    const handleClick = () => {
        if (!product) return;
        setCodigoSeleccionado(codigo, product);
        openCuponModal("cupon");
    };

    return (
        <article
            className="flex flex-col items-start gap-2 w-full text-[var(--white)] bg-[var(--violet)] p-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-[var(--violet-200)] hover:shadow-xl hover:-translate-y-1 min-w-[12rem] cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex w-full items-start justify-between flex-col">
                <div className="flex items-start gap-2 w-full justify-between">
                    <h3 className="text-lg font-bold">VALE</h3>
                    <Hand />
                </div>
                <p className="w-full text-md">{product?.pro_nom}</p>
            </div>
            <span className="mt-5 text-md text-[var(--violet-100)]">
                {restaurant?.res_nom}
            </span>
        </article>
    );
}