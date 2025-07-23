import MainOff from "./MainOff";
import MainOffSkeleton from "./skeletons/MainOffSkeleton";
import { useCodigoGenerado } from "@/hooks/useCodigoGenerado";

interface OffMainContainerProps {
    neg_id: number;
    suc_id: number;
}

export default function OffMainContainer({ neg_id, suc_id }: OffMainContainerProps) {
    const {
        codigosPromocionales,
        loadingPromocionales,
        errorPromocionales,
    } = useCodigoGenerado(
        null,
        'activos',
        neg_id,
        suc_id,
        true 
    );

    if (loadingPromocionales) {
        return <MainOffSkeleton />;
    }

    if (errorPromocionales) {
        return (
            <div className="flex items-center justify-center w-full p-8">
                <p className="text-red-500">Error al cargar códigos promocionales: {errorPromocionales}</p>
            </div>
        );
    }

    if (codigosPromocionales.length === 0) {
        return (
            <div className="flex items-center justify-center w-full p-8">
                <p className="text-gray-500">No hay códigos promocionales disponibles</p>
            </div>
        );
    }

    return (
        <div className="flex items-start justify-between w-full gap-4 overflow-x-auto pt-2 pb-2 overflow-visible">
            {codigosPromocionales.map((codigoPromocional, index) => (
                <MainOff key={`${codigoPromocional.cod_prom_publico}-${index}`} codigoPromocional={codigoPromocional} />
            ))}
        </div>
    );
}