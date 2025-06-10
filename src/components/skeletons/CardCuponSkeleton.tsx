import SkeletonCard from './SkeletonCard';
import SkeletonLine from './SkeletonLine';

export default function CardCuponSkeleton() {
    return (
        <SkeletonCard className="w-full h-32 p-4 space-y-3">
            <SkeletonLine width="w-3/4" height="h-5" />
            <SkeletonLine width="w-1/2" height="h-4" />
            <SkeletonLine width="w-full" height="h-8" />
        </SkeletonCard>
    );
}