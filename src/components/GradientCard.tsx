"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function GradientCard({ children, className = '', delay = 0 }: GradientCardProps) {
    return (
        <motion.div 
            className={`mb-4 bg-[var(--violet-50)] rounded-2xl p-6 border border-[var(--violet-200)] ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.div>
    );
}