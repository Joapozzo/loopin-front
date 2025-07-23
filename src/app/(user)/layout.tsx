"use client";
import { UserSidebarProvider } from "@/context/UserSideBarContext"; 
import LayoutContent from "@/components/layouts/LayoutContent";
import ProtectedRoute from "@/auth/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <ProtectedRoute requireRole="cliente">
            <UserSidebarProvider>
                <LayoutContent>
                    {children}
                </LayoutContent>
            </UserSidebarProvider>
        </ProtectedRoute>
    );
}