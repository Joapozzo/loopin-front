// hooks/useRegisterNavigation.ts
"use client";

import { useRouter } from "next/navigation";
import { useRegister } from "@/context/RegisterContext";

export function useRegisterNavigation() {
    const router = useRouter();
    const { isStep1Complete, clearData } = useRegister();

    const goToStep1 = () => {
        router.push("/register/step1");
    };

    const goToStep2 = () => {
        if (!isStep1Complete) {
            router.push("/register/step1");
            return;
        }
        router.push("/register/step2");
    };

    const goToLogin = () => {
        router.push("/login");
    };

    const goToHome = () => {
        router.push("/");
    };

    const resetAndGoToLogin = () => {
        clearData();
        router.push("/login");
    };

    const canAccessStep2 = () => isStep1Complete;

    return {
        goToStep1,
        goToStep2,
        goToLogin,
        goToHome,
        resetAndGoToLogin,
        canAccessStep2,
        isStep1Complete,
    };
}