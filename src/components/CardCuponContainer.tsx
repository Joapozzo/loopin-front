import { useCodigoGenerado } from "@/hooks/useCodigoGenerado";
import CuponCard from "./CuponCard";
import CardCuponContainerSkeleton from "./skeletons/CardCuponContainerSkeleton";

interface CardCuponContainerProps {
    tipo?: 'activos' | 'inactivos';
}

export default function CardCuponContainer({ tipo = 'activos' }: CardCuponContainerProps) {
    const { codigosActivos, codigosInactivos, loadingCodigos, errorCodigos } = useCodigoGenerado(null, tipo);

    const codigos = tipo === 'activos' ? codigosActivos : codigosInactivos;

    if (loadingCodigos || errorCodigos) {
        return <CardCuponContainerSkeleton />;
    }

    if (codigos.length === 0) {
        const mensaje = tipo === 'activos'
            ? "No tenés cupones disponibles por el momento."
            : "No tenés cupones utilizados aún.";

        return (
            <div className="w-full text-start py-6 text-gray-500">
                {mensaje}
            </div>
        );
    }

    return (
        <div className="flex w-full pt-2 pb-2 gap-4 overflow-hidden overflow-x-auto">
            {[...codigos].reverse().map((codigo, index) => (
                <CuponCard codigo={codigo} key={index} tipo={tipo}/>
            ))}
        </div>
    );
}
