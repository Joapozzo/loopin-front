"use client";
import { Suspense } from 'react';
import AuthContent from './AuthContent';
import SpinnerLoader from "@/components/ui/SpinerLoader";

function AuthLoading() {
    return (
        <div className="h-screen bg-gradient-to-br from-[var(--violet-50)] to-white flex items-center justify-center p-6">
            <style jsx>{`
                :root {
                    --violet: #8b5cf6;
                    --violet-50: #f3f0ff;
                    --violet-200: #c4b5fd;
                    --rose: #f43f5e;
                    --white: #ffffff;
                    --black: #1f2937;
                    --gray: #9ca3af;
                }
            `}</style>
            <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-center">
                    <SpinnerLoader color="text-[var(--violet)]" size="h-8 w-8" />
                    <p className="mt-4 text-[var(--violet)] text-lg font-semibold">
                        Cargando autenticación...
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<AuthLoading />}>
            <AuthContent />
        </Suspense>
    );
}