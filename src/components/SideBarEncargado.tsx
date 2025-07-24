"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Gift,
    Settings,
    LogOut,
    ChefHat,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Star,
    MapPin,
    Ticket,
    Plus,
} from 'lucide-react';
import MenuItem from './MenItem';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/context/SideBarContext';
import { GlassmorphismButton } from './ui/buttons/ButtonGlass';
import { useAuth } from '@/hooks/useAuth';
import { useClientes } from '@/hooks/useClientes';
import { useProductos } from '@/hooks/useProductos';
import { useUserProfile } from '@/hooks/userProfile';
import { useComercioData, useComercioEncargado } from '@/hooks/useComercioEncargado';
import { useCupones } from '@/hooks/useCupones';
import { useVentas } from '@/hooks/useVentas';
import { useCanjes } from '@/hooks/useCanjes';

const ManagerSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();

    const { nombreCompleto, isLoading: profileLoading } = useUserProfile();
    const { loading: comercioLoading, error } = useComercioEncargado();
    const { comercioData, loading: comercioDataLoading } = useComercioData();
    const { isExpanded, toggleSidebar } = useSidebar();

    const isLoadingData = profileLoading || comercioLoading || comercioDataLoading;

    // Función para obtener el item activo basado en la ruta
    const getActiveItemFromPath = (path: string) => {
        if (path === '/res' || path === '/res/dashboard') return 'dashboard';
        if (path.startsWith('/res/clientes')) return 'clientes';
        if (path.startsWith('/res/productos')) return 'productos';
        if (path.startsWith('/res/codigos')) return 'codigos';
        if (path.startsWith('/res/ventas')) return 'ventas';
        if (path.startsWith('/res/canjes')) return 'canjes';
        if (path.startsWith('/res/reportes')) return 'reportes';
        if (path.startsWith('/res/configuracion')) return 'configuracion';
        return 'dashboard';
    };

    const activeItem = getActiveItemFromPath(pathname);

    const { clientesTotales } = useClientes({
        initialPageSize: 15,
    });
    const { productosTotales } = useProductos({
        initialPageSize: 15,
    });

    const { comprasTotales } = useVentas()
    const { canjesTotales } = useCanjes({
        tipoVista: 'encargado'
    })

    const managerData = {
        name: nombreCompleto || "Cargando...",
        restaurant: {
            name: comercioData?.suc_nom || "Cargando restaurante...",
            logo: "/logos/logo-chez.svg",
            address: comercioData?.suc_dir || "Cargando dirección...",
            rating: 4.8,
            tel: comercioData?.suc_cel || "---",
            category: "Parrilla Argentina"
        },
        stats: {
            clientesAdheridos: clientesTotales,
            ventasHoy: 15,
            canjesTotales: canjesTotales,
            puntosOtorgados: 12450,
            productosTotales: productosTotales,
            comprasTotales: comprasTotales
        }
    };

    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard size={22} />,
            description: "Vista general del restaurante",
        },
        {
            id: "clientes",
            label: "Clientes",
            icon: <Users size={22} />,
            description: "Gestión de clientes adheridos",
            badge: managerData.stats.clientesAdheridos,
        },
        {
            id: "productos",
            label: "Productos",
            icon: <ChefHat size={22} />,
            description: "Gestión del menú y productos",
            badge: managerData.stats.productosTotales,
        },
        {
            id: "codigos",
            label: "Cupones",
            icon: <Ticket size={22} />,
            description: "Registro de compras y ventas",
            // badge: managerData.stats.ventasHoy,
        },
        {
            id: "ventas",
            label: "Ventas",
            icon: <ShoppingBag size={22} />,
            description: "Registro de compras y ventas",
            badge: managerData.stats.comprasTotales,
        },
        {
            id: "canjes",
            label: "Canjes",
            icon: <Gift size={22} />,
            description: "Confirmar canjes de puntos",
            badge: managerData.stats.canjesTotales,
            badgeColor: "bg-[var(--rose)]",
        },
    ];

    const goToPage = (id: string) => () => {
        router.push(`/res/${id}`);
    }

    const handleLogout = () => {
        logout();
    }

    // Función dummy para el onClick del MenuItem (ya no necesaria)
    const handleMenuClick = () => { };

    return (
        <aside className={`${isExpanded ? 'w-80' : 'w-20'} fixed top-0 left-0 z-9900 h-screen bg-[var(--violet)] border-r border-gray-200 flex flex-col shadow-lg transition-all duration-300 overflow-y-auto`}>
            {/* Header del Restaurante */}
            <div className={`${isExpanded ? 'p-6' : 'p-3'} border-b border-white/20`}>
                {isExpanded ? (
                    <>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-md backdrop-blur-sm flex-shrink-0">
                                <img src={managerData.restaurant.logo} alt={managerData.restaurant.name} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white/80 text-sm">Panel de</p>
                                <h2 className="text-white text-xl font-bold truncate">
                                    {managerData.restaurant.name}
                                </h2>
                                <div className="flex items-center space-x-1 text-sm text-white/60">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span>{managerData.restaurant.rating}</span>
                                    <span>•</span>
                                    <span>{managerData.restaurant.category}</span>
                                </div>
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors flex-shrink-0"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                <div className="flex items-center space-x-2 text-sm text-white/80 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{managerData.restaurant.address}</span>
                                </div>
                                <div className="text-xs text-white/60">
                                    Encargado: <span className="font-medium text-white">{managerData.name}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10">
                                    <Settings size={16} />
                                    Configurar
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 bg-red-500/20 rounded-lg text-white text-sm hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm border border-red-300/20" onClick={handleLogout}>
                                    <LogOut size={16} />
                                    Salir
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-md backdrop-blur-sm">
                            <img src={managerData.restaurant.logo} alt={managerData.restaurant.name} />
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors w-10 h-10 flex items-center justify-center"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Stats rápidas */}
            {isExpanded && (
                <div className="p-6 border-b border-white/20">
                    <div className="grid grid-cols-2 gap-3">
                        <GlassmorphismButton
                            label="Venta"
                            variant="info"
                            icon={<Plus />}
                        />
                        <GlassmorphismButton
                            label="Canje"
                            variant="warning"
                            icon={<Plus />}
                        />
                    </div>
                </div>
            )}

            {/* Navegación principal */}
            <nav className={`flex-1 ${isExpanded ? 'p-6' : 'p-3'}`}>
                {isExpanded && (
                    <h2 className="text-white/70 text-xs uppercase tracking-wider font-semibold mb-4">
                        Panel de Control
                    </h2>
                )}
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id} onClick={goToPage(item.id)}>
                            <MenuItem
                                item={item}
                                isActive={activeItem === item.id}
                                onClick={handleMenuClick}
                                isExpanded={isExpanded}
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default ManagerSidebar;