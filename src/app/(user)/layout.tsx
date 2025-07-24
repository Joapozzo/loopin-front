"use client";
import { UserSidebarProvider } from "@/context/UserSideBarContext";
import LayoutContent from "@/components/layouts/LayoutContent";
import ProtectedRoute from "@/auth/ProtectedRoute";
import CodigoPromocionalModal from "@/components/modals/CodigoPromocionalModal";
import CuponModal from "@/components/modals/CuponModal";

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <ProtectedRoute requireRole="cliente">
            <UserSidebarProvider>
                <LayoutContent>
                    {children}
                </LayoutContent>
                <CodigoPromocionalModal />
                <CuponModal />
            </UserSidebarProvider>
        </ProtectedRoute>
    );
}