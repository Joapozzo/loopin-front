"use client";
import { UserSidebarProvider } from "@/context/UserSideBarContext";
import LayoutContent from "@/components/layouts/LayoutContent";
import ProtectedRoute from "@/auth/ProtectedRoute";
import CodigoPromocionalModal from "@/components/modals/CodigoPromocionalModal";
import CuponModal from "@/components/modals/CuponModal";
import ConfirmacionCuponModal from "@/components/modals/ConfirmacionCuponModal";

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <ProtectedRoute requireRole="cliente">
            <UserSidebarProvider>
                <LayoutContent>
                    {children}
                </LayoutContent>
                <CodigoPromocionalModal />
                <ConfirmacionCuponModal />
                <CuponModal />
            </UserSidebarProvider>
        </ProtectedRoute>
    );
}