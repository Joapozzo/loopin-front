import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useRoleProtect(allowedRoles: string[]) {
    const { isAuthenticated, userRole, isLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace("/login");
        } else if (userRole && !allowedRoles.includes(userRole)) {
            router.replace("/unauthorized");
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, userRole, isLoading]);

    return { loading: loading || isLoading };
}
