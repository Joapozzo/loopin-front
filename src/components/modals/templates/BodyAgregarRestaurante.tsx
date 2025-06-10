import { useState } from "react";
import Button from "@/components/ui/buttons/Button";
import { PlusCircle } from "lucide-react";
import { useRestaurantStore } from "@/stores/restaurantStore";
import { useTarjetaStore } from "@/stores/useTarjetaStore";
import { addTajerta } from "@/api/tarjetasFetch";
import { useClienteStore } from "@/stores/useClienteCompleto";
import SpinnerLoader from "@/components/ui/SpinerLoader";
import toast from "react-hot-toast";

interface Props {
    handleClose: () => void;
}

export default function ModalAgregarRestBody({ handleClose }: Props) {
    const [loading, setLoading] = useState(false);

    const idRestaurante = useRestaurantStore((state) => state.idRestaurantDelete);
    const clearIdRestaurantDelete = useRestaurantStore((state) => state.clearIdRestaurantDelete);

    const tarjetas = useTarjetaStore((state) => state.tarjetas);
    const actualizarTarjetas = useTarjetaStore((state) => state.fetchTarjetasByCliente);

    const cliente = useClienteStore((state) => state.cliente);

    const yaExiste = tarjetas.some((t) => t.res_id === idRestaurante);

    const handleConfirm = async () => {
        if (!cliente || !idRestaurante) {
            console.error("Falta cliente o Negocio");
            return null;
        }
        setLoading(true);
        try {
            if (yaExiste) {
                toast.error("Este Negocio ya está agregado");
                setLoading(false);
                return;
            }

            const nuevaTarjeta = await addTajerta(+cliente.cli_id, +idRestaurante);
            console.log("Negocio agregado:", nuevaTarjeta);
            toast.success("Negocio agregado");
            await actualizarTarjetas(+cliente.cli_id);
            handleClose();
        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al agregar el negocio");
            setLoading(false);
        } finally {
            setLoading(false);
            handleClose();
        }
    }; 

    const handleCancel = () => {
        if (loading) return;
        clearIdRestaurantDelete();
        handleClose();
    };

    return (
        <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-[var(--white)] p-3 rounded-full">
                <PlusCircle className="text-green-600 w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">¿Agregar negocio?</h2>
            <p className="text-sm text-gray-500">
                ¿Estás seguro de que querés agregar este negocio a tu cuenta?
            </p>
            <div className="flex gap-4 pt-4 w-full">
                <Button variant="outline" className="w-full" onClick={handleCancel} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="success" className="w-full" onClick={handleConfirm} disabled={loading}>
                    {loading ? (
                        <SpinnerLoader />
                    ) : (
                        "Agregar"
                    )}
                </Button>
            </div>
        </div>
    );
}
