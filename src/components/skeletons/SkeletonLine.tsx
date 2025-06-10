import SkeletonBase from './SkeletonBase';

interface SkeletonLineProps {
    width?: string;
    height?: string;
    className?: string;
}

export default function SkeletonLine({ 
    width = 'w-full', 
    height = 'h-4', 
    className = '' 
}: SkeletonLineProps) {
    return (
        <SkeletonBase className={`bg-gray-300 rounded ${width} ${height} ${className}`} />
    );
}