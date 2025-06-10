"use client";

import { ReactNode } from 'react';

interface MobilePaddingProps {
    children: ReactNode;
    className?: string;
}

export default function MobileLayout({ children, className = '' }: MobilePaddingProps) {
    return (
        <div className={`md:contents px-5 pb-20 md:p-0 space-y-6 md:space-y-0 md:gap-6 md:flex md:flex-col ${className}`}>
            {children}
        </div>
    );
}