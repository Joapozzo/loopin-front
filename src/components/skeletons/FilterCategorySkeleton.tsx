import SkeletonCard from './SkeletonCard';

export default function FilterCategorySkeleton() {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonCard key={i} className="min-w-[80px] h-8 rounded-full" />
            ))}
        </div>
    );
}