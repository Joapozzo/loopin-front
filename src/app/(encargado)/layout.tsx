import EncargadoLayout from "@/components/layouts/EncargadoLayout";
import ManagerSidebar from "@/components/SideBarEncargado";
import { SidebarProvider } from "@/context/SideBarContext"; 

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <ManagerSidebar />
            <EncargadoLayout>
                {children}
            </EncargadoLayout>
        </SidebarProvider>
    );
}