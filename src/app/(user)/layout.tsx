"use client";
import MenuBottom from "@/components/MenuBottom";
import { useProductStore } from "@/stores/productStore";
import { useRestaurantStore } from "@/stores/restaurantStore";
import { useClienteStore } from "@/stores/useClienteCompleto";
import { useTarjetaStore } from "@/stores/useTarjetaStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useRoleProtect } from "@/hooks/useRoleProtect";
import FullLoader from "@/components/ui/FullLoader";
import { UserSidebarProvider } from "@/context/UserSideBarContext"; 
import LayoutContent from "@/components/layouts/LayoutContent";

export default function Layout({ children }: { children: React.ReactNode }) {
    // const { loading } = useRoleProtect(["3"]);

    const fetchClienteCompleto = useClienteStore((s) => s.fetchClienteCompleto);
    const fetchProducts = useProductStore((s) => s.fetchProducts);
    const fetchRestaurants = useRestaurantStore((s) => s.fetchRestaurants);
    const fetchTarjetasByCliente = useTarjetaStore((s) => s.fetchTarjetasByCliente);
    
    useEffect(() => {
        fetchProducts();
        fetchRestaurants();
        // id usuario
        fetchClienteCompleto(9);
        // id cliente
        fetchTarjetasByCliente(2);
    }, []);

    // if (loading) {
    //     return <FullLoader />;
    // }

    return (
        <UserSidebarProvider>
            <LayoutContent>
                {children}
            </LayoutContent>
            <Toaster />
        </UserSidebarProvider>
    );
}