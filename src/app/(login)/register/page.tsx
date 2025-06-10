"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SpinnerLoader from "@/components/ui/SpinerLoader";

export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/register/step1");
    }, [router]);

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="text-center">
                <SpinnerLoader />
                <p className="text-gray-600">Redirigiendo...</p>
            </div>
        </div>
    );
}