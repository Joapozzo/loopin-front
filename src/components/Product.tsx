import { Product as ProductType } from "@/types/product";
import Button from "./ui/buttons/Button";
import { useModalStore } from "@/stores/useModalStore";
import { useProductoStore } from "@/stores/useProductStore";
import toast from "react-hot-toast";
import Image from "next/image";

interface ProductProps {
    product: ProductType;
    puntos: number;
    hasRestaurantSelected?: boolean;
}

export default function Product({ product, puntos, hasRestaurantSelected }: ProductProps) {
    const { pro_nom, pro_puntos_canje, public_url, suc_nom } = product;

    const openModal = useModalStore((state) => state.openModal);
    const setProducto = useProductoStore((state) => state.setProducto);

    const handleOpenModal = (producto: ProductType) => {
        if (producto.pro_cantidad_disp === 0 || producto.pro_cantidad_disp === null) {
            toast.error("No hay stock disponible para este producto");
            return;
        }
        if (producto.pro_activo === 0) {
            toast.error("El producto no está activo");
            return;
        }
        openModal("cupon");
        setProducto(producto);
    };

    const alcanza = puntos >= pro_puntos_canje;
    const puntosRestantes = Math.abs(puntos - pro_puntos_canje);

    const imagenFallback = "../food/hamburguesa.png";

    return (
        <div className="w-full h-96 flex flex-col items-center rounded-2xl shadow-md bg-[var(--white-100)] p-4 gap-3">
            <span className="text-xs font-semibold text-[var(--violet)] bg-[var(--violet-100)] px-2 py-1 rounded-md -mt-1">
                {suc_nom}
            </span>

            <div className="w-full h-32 flex items-center justify-center">
                <Image
                    src={public_url || imagenFallback}
                    alt="Producto"
                    className="max-w-full max-h-full object-contain"
                    width={200}
                    height={200}
                />
            </div>

            <h3 className="font-bold text-[var(--black)] text-center text-xl">
                {pro_nom}
            </h3>

            {hasRestaurantSelected ? (
                <div className="w-full flex flex-col items-center rounded-lg px-3 py-2 text-center text-[var(--white)] gap-2">
                    <p
                        className="text-xl font-extrabold leading-none"
                        style={{ color: alcanza ? "var(--violet-200)" : "var(--rose)" }}
                    >
                        {puntos} / {pro_puntos_canje}
                    </p>
                    <p
                        className="text-md leading-none"
                        style={{ color: alcanza ? "var(--violet-200)" : "var(--rose)" }}
                    >
                        te {alcanza ? "sobran" : "faltan"}{" "}
                        <span className="font-bold">{puntosRestantes} puntos</span> para
                        canjear este producto
                    </p>
                </div>
            ) : (
                // Mostrar solo el costo del producto
                <div className="w-full flex flex-col items-center rounded-lg px-3 py-2 text-center text-[var(--white)] gap-2 bg-[var(--violet-50)]">
                    <p className="text-xl font-extrabold leading-none text-[var(--violet)]">
                        {pro_puntos_canje}
                    </p>
                    <p className="text-md leading-none text-[var(--violet)]">
                        Puntos para canjear
                    </p>
                </div>
            )}

            {/* Comentado temporalmente */}
            {/* <Button variant="primary" fullWidth size="lg" disabled={!alcanza} onClick={() => openModal(product)}>
                + Canjear
            </Button> */}

            <Button
                variant="primary"
                fullWidth
                size="lg"
                className="w-full py-3 px-4 bg-[var(--violet)] text-white text-center rounded-lg font-medium"
                disabled={!alcanza || !hasRestaurantSelected}
                onClick={() => handleOpenModal(product)}
            >
                + Canjear
            </Button>
        </div>
    );
}