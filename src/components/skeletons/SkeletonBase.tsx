"use client";

interface SkeletonBaseProps {
    className?: string;
    children?: React.ReactNode;
}

export default function SkeletonBase({ className = '', children }: SkeletonBaseProps) {
    return (
        <div className={`animate-pulse ${className}`}>
            {children}
        </div>
    );
}