import { useState } from "react";
import Button from "@/components/ui/buttons/Button";
import { AlertCircle } from "lucide-react";
import { useRestaurantStore } from "@/stores/useRestaurantStore";
import { useTarjetaStore } from "@/stores/useTarjetasStore";
import { deleteTarjetaByUser } from "@/api/tarjetasFetch";
// import { useClienteStore } from "@/stores/useClienteCompleto";
import SpinnerLoader from "@/components/ui/SpinerLoader";
import toast from "react-hot-toast";
import { useUserProfile } from "@/hooks/userProfile";

interface Props {
    handleClose: () => void;
}

export default function ModalConfirmationBody({ handleClose }: Props) {
    const [loading, setLoading] = useState(false);

    const clearIdRestaurantDelete = useRestaurantStore((state) => state.clearIdRestaurantSelected);
    const idRestaurante = useRestaurantStore((state) => state.idRestaurantSelected);
    // const cliente = useClienteStore((state) => state.cliente);
    const tarjetas = useTarjetaStore((state) => state.tarjetas);
    const actualizarTarjetas = useTarjetaStore((state) => state.fetchTarjetasByCliente);
    const { clienteId } = useUserProfile();


    const handleConfirm = async () => {

        if (!clienteId || !idRestaurante) {
            toast.error("Falta cliente o restaurante");
            return null;
        }

        const tarjetaAEliminar = tarjetas.find((t) => +t.suc_id === +idRestaurante);

        setLoading(true);
        try {
            if (!tarjetaAEliminar) {
                toast.error("Tarjeta no encontrada para eliminar");
                setLoading(false);
                return;
            }
            await deleteTarjetaByUser(tarjetaAEliminar.tar_id);
            await actualizarTarjetas(+clienteId);
            toast.success("Negocio eliminado");
            handleClose();
        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al eliminar el negocio");
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
            <AlertCircle className="text-[var(--violet)] w-10 h-8" />
            <h2 className="text-xl font-bold">¿Eliminar negocio?</h2>
            <p className="text-sm text-gray-500">
                ¿Estás seguro de que querés eliminar este negocio?
                <br />
                Esta acción eliminará todos tus puntos y no se puede deshacer.
            </p>
            <div className="flex gap-4 pt-4 w-full">
                <Button variant="danger" className="w-full" onClick={handleCancel} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="primary" className="w-full" onClick={handleConfirm} disabled={loading}>
                    {loading ? (
                        <SpinnerLoader />
                    ) : (
                        "Eliminar"
                    )}
                </Button>
            </div>
        </div>
    );
}
