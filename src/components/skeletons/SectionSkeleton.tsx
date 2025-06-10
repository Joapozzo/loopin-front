import SkeletonLine from './SkeletonLine';

interface SectionSkeletonProps {
    children?: React.ReactNode;
    hasTitle?: boolean;
}

export default function SectionSkeleton({ children, hasTitle = true }: SectionSkeletonProps) {
    return (
        <div className="space-y-4">
            {hasTitle && (
                <SkeletonLine width="w-48" height="h-6" />
            )}
            {children}
        </div>
    );
}