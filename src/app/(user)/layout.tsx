"use client";
import { UserSidebarProvider } from "@/context/UserSideBarContext";
import LayoutContent from "@/components/layouts/LayoutContent";
import ProtectedRoute from "@/auth/ProtectedRoute";
import CodigoPromocionalModal from "@/components/modals/CodigoPromocionalModal";
import CuponModal from "@/components/modals/CuponModal";
import ConfirmacionCuponModal from "@/components/modals/ConfirmacionCuponModal";
import BirthdayGiftModal from "@/components/modals/BirthdayGiftModal";
import CuponPuntosModal from "@/components/CuponPuntosComponent";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requireRole="cliente">
            <UserSidebarProvider>
                <LayoutContent>
                    {children}
                </LayoutContent>
                <BirthdayGiftModal/>
                <CodigoPromocionalModal />
                <ConfirmacionCuponModal />
                <CuponModal />
                <CuponPuntosModal/>
            </UserSidebarProvider>
        </ProtectedRoute>
    );
}