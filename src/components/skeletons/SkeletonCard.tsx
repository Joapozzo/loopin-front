import SkeletonBase from './SkeletonBase';

interface SkeletonCardProps {
    className?: string;
    children?: React.ReactNode;
}

export default function SkeletonCard({ className = '', children }: SkeletonCardProps) {
    return (
        <SkeletonBase className={`bg-gray-200 rounded-lg ${className}`}>
            {children}
        </SkeletonBase>
    );
}