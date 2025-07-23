import { useState } from "react";
import Button from "@/components/ui/buttons/Button";
import { PlusCircle } from "lucide-react";
import { useRestaurantStore } from "@/stores/useRestaurantStore";
import SpinnerLoader from "@/components/ui/SpinerLoader";
import toast from "react-hot-toast";
import { useTarjetas } from "@/hooks/useTarjetas";
import { useSucursalesCliente } from "@/hooks/useSucursales"; // 🔄 AGREGAR ESTE HOOK

interface Props {
    handleClose: () => void;
}

export default function ModalAgregarRestBody({ handleClose }: Props) {
    const [loading, setLoading] = useState(false);
    
    const { createTarjeta, getTarjetaBySucursal } = useTarjetas();
    const { refresh: refreshSucursalesCliente } = useSucursalesCliente(); // 🔄 PARA ACTUALIZAR SUCURSALES

    const idRestaurantSelected = useRestaurantStore((state) => state.idRestaurantSelected);
    const clearIdRestaurantSelected = useRestaurantStore((state) => state.clearIdRestaurantSelected);

    const sucId = idRestaurantSelected?.suc_id;
    const negId = idRestaurantSelected?.neg_id;

    const tarjetaExistente = sucId ? getTarjetaBySucursal(sucId) : null;
    
    const handleConfirm = async () => {
        if (!sucId || !negId) {
            toast.error("Faltan datos para agregar el negocio");
            return;
        }

        if (tarjetaExistente) {
            toast.error("Este negocio ya está agregado a tu cuenta");
            return;
        }

        setLoading(true);
        
        try {
            await createTarjeta(+sucId, +negId);
            console.log("✅ Negocio agregado:", sucId, negId);
            
            await refreshSucursalesCliente();
            console.log("🔄 Sucursales del cliente actualizadas");
            
            toast.success("Comercio agregado con éxito");
            
        } catch (error) {
            console.error("❌ Error al agregar negocio:", error);
            toast.error("Hubo un error al agregar el negocio");
        } finally {
            setLoading(false);
            clearIdRestaurantSelected();
            handleClose();
        }
    };

    const handleCancel = () => {
        if (loading) return;
        clearIdRestaurantSelected();
        handleClose();
    };

    return (
        <div className="flex flex-col items-center text-center gap-4">
            <PlusCircle className="text-[var(--violet)] w-10 h-8" />
            <h2 className="text-xl font-bold">¿Agregar negocio?</h2>
            
            {sucId && negId && (
                <p className="text-sm text-gray-500">
                    ¿Estás seguro de que querés agregar este negocio a tu cuenta?
                </p>
            )}
            
            {tarjetaExistente && (
                <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                    ⚠️ Este negocio ya está en tu cuenta
                </p>
            )}
            
            <div className="flex gap-4 pt-4 w-full">
                <Button 
                    variant="danger" 
                    className="w-full" 
                    onClick={handleCancel} 
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button 
                    variant="primary" 
                    className="w-full" 
                    onClick={handleConfirm} 
                    disabled={loading || !!tarjetaExistente}
                >
                    {loading ? (
                        <SpinnerLoader />
                    ) : (
                        tarjetaExistente ? "Ya agregado" : "Agregar"
                    )}
                </Button>
            </div>
        </div>
    );
}