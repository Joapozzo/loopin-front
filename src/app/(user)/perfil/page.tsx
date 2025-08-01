"use client";
import ConfigMenu from "@/components/ConfigMenu";
import HeroLayout from "@/components/layouts/HeroLayout";
import MobileLayout from "@/components/layouts/MobileLayout";
import GradientCard from "@/components/GradientCard";
import PerfilItemCard from "@/components/PerfilItemCard";
import PerfilStaticCard from "@/components/PerfilStaticCard";
import Section from "@/components/Section";
import BackButton from "@/components/ui/buttons/BackButton";
import Icon from "@/components/ui/Icon";
import { useConfigStore } from "@/stores/useConfigStore";
import { useCanjes } from "@/hooks/useCanjes";
import { User, Store, Mail, PhoneCall, MapPin, Ticket, Settings, History, TrendingUp, Gift, WalletCards, LogOutIcon } from "lucide-react";
import { useUserProfile } from "@/hooks/userProfile";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/buttons/Button";
import { useModalStore } from "@/stores/useModalStore";

export default function Page() {
    const { toggle } = useConfigStore();
    const { userData: usuario } = useUserProfile();
    const openModal = useModalStore((state) => state.openModal);

    const {
        estadisticas,
        loadingCliente,
        errorCliente,
        canjesCliente
    } = useCanjes({
        tipoVista: 'cliente',
        enabled: true
    });

    const { logout } = useAuth();

    const handleOpenCuponModal = () => {
        openModal("cupon-puntos");
    };

    if (!usuario) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-gray-500 text-lg">Cargando perfil...</p>
            </div>
        );
    }

    const totalCanjes = canjesCliente.length;

    return (
        <>
            <ConfigMenu />

            {/* VERSIÓN MÓVIL - Funcionalidad completa */}
            <div className="md:hidden">
                <HeroLayout>
                    {/* Arriba */}
                    <div className="flex items-center justify-between w-full">
                        <BackButton />
                        <span className="flex items-center justify-center gap-2">
                            <Icon name="settings" onClick={toggle} />
                            <Icon
                                name="logout"
                                onClick={logout}
                                backgroundColor="var(--rose)"
                            />
                        </span>
                    </div>
                    <div className="flex items-center flex-col gap-4 w-full">
                        <img
                            src="/user-default.webp"
                            alt=""
                            className="h-20 w-20 rounded-full bg-[var(--violet-100)] object-cover p-2"
                        />
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-3xl font-medium text-white">
                                {usuario.cli_nom} {usuario.cli_ape}
                            </h3>
                        </div>
                        <div className="flex items-center gap-1">
                            <h4 className="text-4xl font-bold text-white">
                                {loadingCliente ? "..." : totalCanjes}
                            </h4>
                            <p className="text-sm text-white/80">canjes totales</p>
                        </div>
                        <Button
                            variant="light"
                            size="md"
                            onClick={handleOpenCuponModal}
                        >
                            <Gift size={24} />
                            Tengo un cupón!
                        </Button>
                    </div>
                </HeroLayout>
            </div>

            {/* VERSIÓN ESCRITORIO - Adaptado con cards */}
            <div className="hidden md:block">
                <div className="space-y-6">
                    {/* Header de navegación */}
                    <GradientCard>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4 flex-col">
                                <BackButton />
                                <h1 className="text-[var(--violet)] text-2xl font-bold">
                                    Mi Perfil
                                </h1>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggle}
                                    className="p-2 bg-white/70 rounded-lg hover:bg-white transition-colors border border-white/60"
                                >
                                    <Settings size={20} className="text-[var(--violet)]" />
                                </button>
                            </div>
                        </div>
                    </GradientCard>

                    {/* Información del usuario */}
                    <GradientCard delay={0.1}>
                        <div className="flex items-center gap-6">
                            <img
                                src="/user-default.webp"
                                alt="Perfil"
                                className="h-24 w-24 rounded-full bg-white/70 object-cover p-3 border border-white/60"
                            />
                            <div className="flex-1">
                                <h2 className="text-[var(--violet)] text-2xl font-medium mb-2">
                                    {usuario.cli_nom} {usuario.cli_ape}
                                </h2>
                                <Button variant="light" size="md" className="" onClick={handleOpenCuponModal}>
                                    <Gift size={24} />
                                    Tengo un cupón!
                                </Button>
                            </div>
                        </div>
                    </GradientCard>
                </div>
            </div>

            {/* Contenido con padding solo en móvil */}
            <MobileLayout>
                <Section>
                    {/* Estadísticas de canjes */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Actividad de Canjes
                        </h3>
                        {loadingCliente ? (
                            <div className="bg-gray-100 rounded-lg p-6 text-center">
                                <p className="text-gray-500">Cargando estadísticas...</p>
                            </div>
                        ) : errorCliente ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm">
                                    Error al cargar el historial de canjes
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="border text-[var(--violet-200)] rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp
                                            size={24}
                                            className="text-[var(--violet-200)]"
                                        />
                                        <div>
                                            <p className="text-2xl font-bold text-[var(--violet-200)]">
                                                {totalCanjes}
                                            </p>
                                            <p className="text-[var(--violet-200)] text-sm">
                                                Canjes Totales
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border text-[var(--violet-200)] rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <Ticket size={24} className="text-[var(--violet-200)]" />
                                        <div>
                                            <p className="text-2xl font-bold text-[var(--violet-200)]">
                                                {estadisticas.canjesEncargado}
                                            </p>
                                            <p className="text-[var(--violet-200)] text-sm">
                                                Por Puntos
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border text-[var(--violet-200)] rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <Gift size={24} className="text-[var(--violet-200)]" />
                                        <div>
                                            <p className="text-2xl font-bold text-[var(--violet-200)]">
                                                {estadisticas.canjesPromocion}
                                            </p>
                                            <p className="text-[var(--violet-200)] text-sm">
                                                Promocionales
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/perfil/historial-canjes" className="block">
                                    <div className="bg-[var(--violet-50)] border border-[var(--violet-200)] rounded-lg p-4 hover:bg-[var(--violet-100)] transition-colors cursor-pointer h-full">
                                        <div className="flex items-center gap-3">
                                            <History size={24} className="text-[var(--violet)]" />
                                            <div>
                                                <p className="text-[var(--violet)] font-semibold">
                                                    Ver Historial
                                                </p>
                                                <p className="text-[var(--violet)] text-sm opacity-75">
                                                    Completo
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Acciones rápidas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <PerfilItemCard text="Tus cupones" icon={Ticket} url="/cupones" />
                        <PerfilItemCard
                            text="Credenciales"
                            icon={User}
                            url="/perfil/credenciales"
                        />
                        <PerfilItemCard
                            text="Tus Comercios"
                            icon={Store}
                            url="/restaurantes"
                        />
                    </div>

                    {/* Información personal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 hidden md:block">
                            Información personal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PerfilStaticCard
                                label="Nombre"
                                value={usuario.cli_nom}
                                icon={User}
                            />
                            <PerfilStaticCard
                                label="Apellido"
                                value={usuario.cli_ape}
                                icon={User}
                            />
                            <PerfilStaticCard
                                label="DNI"
                                value={usuario.usu_dni}
                                icon={WalletCards}
                            />
                            <PerfilStaticCard
                                label="Email"
                                value={usuario.usu_mail}
                                icon={Mail}
                            />
                            <PerfilStaticCard
                                label="Teléfono"
                                value={usuario.usu_cel}
                                icon={PhoneCall}
                            />
                            {/* <PerfilStaticCard label="Ubicación" value={usuario.loc_nom} icon={MapPin} /> */}
                        </div>
                    </div>
                </Section>
            </MobileLayout>
        </>
    );
}