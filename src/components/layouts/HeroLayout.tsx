"use client";

// Este es el componente HeroLayout modificado para aceptar una className
// Esto permite añadir el padding top cuando sea necesario

import { ReactNode } from "react";

interface HeroLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function HeroLayout({ children, className = "" }: HeroLayoutProps) {
  return (
    <section className={`w-full flex flex-col items-center justify-center bg-[var(--violet)] py-10 px-5 gap-7 rounded-b-4xl mb-5 ${className}`}>
      {children}
    </section>
  );
}