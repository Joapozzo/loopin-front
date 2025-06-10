import SkeletonCard from './SkeletonCard';
import SkeletonLine from './SkeletonLine';

export default function MainOffSkeleton() {
    return (
        <SkeletonCard className="min-w-[200px] h-48 p-4 space-y-3">
            <SkeletonCard className="w-full h-24" />
            <SkeletonLine width="w-full" height="h-5" />
            <SkeletonLine width="w-2/3" height="h-4" />
        </SkeletonCard>
    );
}