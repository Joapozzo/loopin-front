import SkeletonCard from './SkeletonCard';
import SkeletonLine from './SkeletonLine';
import SkeletonCircle from "./SkeletonCircle";

export default function ProductCardSkeleton() {
    return (
        <SkeletonCard className="w-full h-96 p-4 space-y-3">
            {/* Restaurant tag */}
            <SkeletonLine width="w-24" height="h-5" className="rounded-md" />
            
            {/* Product image */}
            <SkeletonCard className="w-32 h-32 mx-auto" />
            
            {/* Product name */}
            <SkeletonLine width="w-full" height="h-6" />
            
            {/* Points section */}
            <SkeletonCard className="w-full h-16" />
            
            {/* Button */}
            <SkeletonCard className="w-full h-12" />
        </SkeletonCard>
    );
}