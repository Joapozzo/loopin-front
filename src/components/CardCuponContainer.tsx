import { useCodigos } from "@/hooks/useCodigos";
import CuponCard from "./CuponCard";
import CardCuponContainerSkeleton from "./skeletons/CardCuponContainerSkeleton";

export default function CardCuponContainer() {
    const { codigos, loading, error } = useCodigos();

    if (loading) {
        return <CardCuponContainerSkeleton />;
    }

    return (
        <div className="flex items-center justify-between w-full overflow-x-auto gap-4">
            {codigos && codigos.map((codigo, index) => (
                <CuponCard codigo={codigo} key={index} />
            ))}
        </div>
    )
}