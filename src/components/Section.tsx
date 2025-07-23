"use client";
import { motion } from "framer-motion";

interface SectionProps {
    id?: string;
    title?: string;
    children: React.ReactNode;
}

export default function Section({ title, children, id }: SectionProps) {
    return (
        <motion.section
            id={id}
            className="flex flex-col gap-3 w-full mt-2"
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {title && (
                <h2 className="text-xl font-bold text-[var(--violet)]">
                    {title}
                </h2>
            )}
            {children}
        </motion.section>
    );
}
