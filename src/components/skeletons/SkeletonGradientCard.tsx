import SkeletonBase from './SkeletonBase';

interface SkeletonGradientCardProps {
    className?: string;
    children?: React.ReactNode;
}

export default function SkeletonGradientCard({ className = '', children }: SkeletonGradientCardProps) {
    return (
        <SkeletonBase className={`bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-6 border border-gray-200 ${className}`}>
            {children}
        </SkeletonBase>
    );
}