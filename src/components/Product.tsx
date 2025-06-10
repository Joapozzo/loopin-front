import { useRestaurantStore } from "@/stores/restaurantStore";
import { Product as ProductType } from "@/types/product";
import { Restaurant } from "@/types/restaurant";
import { useEffect, useState } from "react";
import Button from "./ui/buttons/Button";
import { useModalStore } from "@/stores/useModalStore";
import { useCodigosStore } from "@/stores/codigosStore";

interface ProductProps {
    product: ProductType;
    puntos: number;
}

export default function Product({ product, puntos }: ProductProps) {
    const { pro_nom, pro_puntos_canje, pro_url_foto, res_id, pro_id } = product;

    const getRestaurantById = useRestaurantStore((state) => state.getRestaurantById);
    const setCodigoSeleccionado = useCodigosStore((state) => state.setCodigoSeleccionado);
    const openCuponModal = useModalStore((s) => s.openModal);
    const [restaurant, setRestaurant] = useState<Restaurant | undefined>();
    const [alcanza, setAlcanza] = useState(false);

    useEffect(() => {
        const res = getRestaurantById(res_id);
        if (res) setRestaurant(res);
    }, [res_id]);

    useEffect(() => {
        setAlcanza(puntos >= pro_puntos_canje);
    }, [puntos, pro_puntos_canje]);

    const puntosRestantes = Math.abs(puntos - pro_puntos_canje);

    const openModal = (product: ProductType) => {
        openCuponModal("cupon");
        setCodigoSeleccionado(null, product);
    };

    return (
        <div className="w-full h-96 flex flex-col items-center rounded-2xl shadow-md bg-[var(--white-100)] p-4 gap-3">
            <span className="text-xs font-semibold text-[var(--violet)] bg-[var(--violet-100)] px-2 py-1 rounded-md -mt-1">
                {restaurant?.res_nom ?? "Cargando..."}
            </span>

            <img
                src={pro_url_foto}
                alt="Hamburguesa doble queso"
                className="w-50 h-50 object-contain"
            />

            <h3 className="font-bold text-[var(--black)] text-center text-xl">
                {pro_nom}
            </h3>

            <div className="w-full flex flex-col items-center rounded-lg px-3 py-2 text-center text-[var(--white)] gap-2" style={{ backgroundColor: alcanza ? "var(--skyblue)" : "var(--rose)" }}>
                <p className="text-xl font-extrabold leading-none" style={{ color: alcanza ? "var(--violet)" : "var(--white)" }}>{puntos} / {pro_puntos_canje}</p>
                <p className="text-md leading-none" style={{ color: alcanza ? "var(--violet)" : "var(--white)" }}>
                    te {alcanza ? "sobran" : "faltan"} <span className="font-bold">{puntosRestantes} puntos</span> para canjear este producto
                </p>
            </div>

            <Button variant="primary" fullWidth size="lg" disabled={!alcanza} onClick={() => openModal(product)}>
                + Canjear
            </Button>
        </div>
    );
}