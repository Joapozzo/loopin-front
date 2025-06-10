import SkeletonBase from './SkeletonBase';

interface SkeletonCircleProps {
    size?: string;
    className?: string;
}

export default function SkeletonCircle({ size = 'w-12 h-12', className = '' }: SkeletonCircleProps) {
    return (
        <SkeletonBase className={`bg-gray-300 rounded-full ${size} ${className}`} />
    );
}