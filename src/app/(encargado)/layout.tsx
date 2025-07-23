import ProtectedRoute from "@/auth/ProtectedRoute";
import EncargadoLayout from "@/components/layouts/EncargadoLayout";
import ManagerSidebar from "@/components/SideBarEncargado";
import { SidebarProvider } from "@/context/SideBarContext"; 

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requireRole="encargado">
            <SidebarProvider>
                <ManagerSidebar />
                <EncargadoLayout>
                    {children}
                </EncargadoLayout>
            </SidebarProvider>
        </ProtectedRoute>
    );
}