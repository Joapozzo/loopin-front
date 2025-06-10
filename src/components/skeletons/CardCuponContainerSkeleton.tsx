import CardCuponSkeleton from './CardCuponSkeleton';

export default function CardCuponContainerSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {[1, 2, 3].map((i) => (
                <CardCuponSkeleton key={i} />
            ))}
        </div>
    );
}