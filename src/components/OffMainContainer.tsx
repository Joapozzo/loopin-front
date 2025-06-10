import MainOff from "./MainOff";
import MainOffSkeleton from "./skeletons/MainOffSkeleton";

export default function OffMainContainer() {
    const loading = false;
    if (loading) {
        return <MainOffSkeleton />;
    }
    return (
        <div className="flex items-center justify-between w-full overflow-x-auto gap-4">
            <MainOff
                nombre="Pizza Napolitana"
                puntos={1000}
                imagen="/food/pizza.avif"
            />
            <MainOff
                nombre="Pizza Napolitana"
                puntos={1000}
                imagen="/food/pizza.avif"
            />
        </div>
    );
}