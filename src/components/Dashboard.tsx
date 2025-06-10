// components/dashboard/Dashboard.tsx
"use client";

import React from 'react';
import { ShoppingBag, DollarSign, Users, Star } from 'lucide-react';
import { StatCard } from './StatCard';
import { SimpleChart } from './SimpleChart';
import { RecentSales } from './RecentSales';
import { QuickActions } from './QuickActions';
import { TopProducts } from './TopProducts';
import { NotificationCenter } from './NotificacionCenter'; 
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatCurrency, formatFullDate } from '@/utils/formatters';

const Dashboard: React.FC = () => {
    const {
        stats,
        sales,
        products,
        notifications,
        chartData,
        isLoading,
        error,
        refreshData,
        markNotificationAsRead
    } = useDashboardData();

    // Handlers para las acciones rápidas
    const handleNewSale = () => {
        console.log('Abrir modal de nueva venta');
        // Aquí iría la lógica para abrir el modal de nueva venta
    };

    const handleConfirmCanjes = () => {
        console.log('Ir a página de canjes');
        // Aquí iría la navegación a la página de canjes
    };

    const handleViewClients = () => {
        console.log('Ir a página de clientes');
        // Aquí iría la navegación a la página de clientes
    };

    const handleGenerateReport = () => {
        console.log('Generar reporte');
        // Aquí iría la lógica para generar reporte
    };

    const handleViewAllSales = () => {
        console.log('Ver todas las ventas');
        // Aquí iría la navegación a la página de ventas
    };

    const handleViewAllNotifications = () => {
        console.log('Ver todas las notificaciones');
        // Aquí iría la navegación a la página de notificaciones
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-[var(--rose)] font-medium mb-2">Error al cargar el dashboard</p>
                    <button
                        onClick={refreshData}
                        className="bg-[var(--violet)] text-white px-4 py-2 rounded-lg hover:bg-[var(--violet-200)] transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--violet)]">Dashboard</h1>
                    <p className="text-[var(--violet-200)] mt-1">
                        Resumen de hoy - {formatFullDate(new Date())}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={refreshData}
                        disabled={isLoading}
                        className="bg-white border border-[var(--gray-200)] text-[var(--gray-400)] px-4 py-2 rounded-xl hover:bg-[var(--gray-100)] transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Actualizando...' : 'Actualizar'}
                    </button>
                    <button
                        onClick={handleGenerateReport}
                        className="bg-[var(--violet)] text-white px-6 py-3 rounded-xl hover:bg-[var(--violet-200)] transition-colors"
                    >
                        Exportar Reporte
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)] animate-pulse">
                            <div className="w-12 h-12 bg-[var(--gray-200)] rounded-xl mb-4"></div>
                            <div className="h-8 bg-[var(--gray-200)] rounded mb-2"></div>
                            <div className="h-4 bg-[var(--gray-200)] rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Cards */}
            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Ventas de Hoy"
                        value={stats.ventasHoy}
                        change={stats.crecimientoVentas}
                        icon={<ShoppingBag size={24} />}
                        color="bg-[var(--violet)]"
                        subtitle="vs. ayer"
                    />
                    <StatCard
                        title="Monto Total"
                        value={formatCurrency(stats.montoTotal)}
                        change={15.2}
                        icon={<DollarSign size={24} />}
                        color="bg-[var(--success)]"
                        subtitle="ingreso del día"
                    />
                    <StatCard
                        title="Clientes Atendidos"
                        value={stats.clientesAtendidos}
                        change={stats.crecimientoClientes}
                        icon={<Users size={24} />}
                        color="bg-[var(--skyblue)]"
                        subtitle="personas únicas"
                    />
                    <StatCard
                        title="Puntos Otorgados"
                        value={stats.puntosOtorgados.toLocaleString()}
                        icon={<Star size={24} />}
                        color="bg-[var(--rose)]"
                        subtitle="total acumulado"
                    />
                </div>
            )}

            {/* Charts and Actions */}
            {!isLoading && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <SimpleChart
                            title="Ventas de la Semana"
                            data={chartData.ventas}
                            labels={chartData.labels}
                            color="bg-[var(--violet)]"
                        />
                    </div>
                    <QuickActions
                        onNewSale={handleNewSale}
                        onConfirmCanjes={handleConfirmCanjes}
                        onViewClients={handleViewClients}
                        onGenerateReport={handleGenerateReport}
                        canjesPendientes={stats.canjesPendientes}
                    />
                </div>
            )}

            {/* Tables and Lists */}
            {!isLoading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentSales
                        sales={sales}
                        onViewAll={handleViewAllSales}
                    />
                    <TopProducts products={products} />
                </div>
            )}

            {/* Notifications */}
            {!isLoading && (
                <NotificationCenter
                    notifications={notifications}
                    onMarkAsRead={markNotificationAsRead}
                    onViewAll={handleViewAllNotifications}
                />
            )}
        </div>
    );
};

export default Dashboard;