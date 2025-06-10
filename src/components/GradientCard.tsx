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
            className={`bg-gradient-to-r from-[var(--violet-50)] to-[var(--violet-100)] rounded-2xl p-6 border border-[var(--violet-200)]/20 shadow-sm ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.div>
    );
}