// hooks/useDashboardData.ts
"use client";

import { useState, useEffect } from 'react';
import { DashboardStats, SaleData, ProductoVendido, NotificationItem } from '@/types/dashboard';
import {
    mockStats,
    mockSales,
    mockProducts,
    mockNotifications,
    mockChartData
} from '@/data/dashboardData';

interface DashboardData {
    stats: DashboardStats;
    sales: SaleData[];
    products: ProductoVendido[];
    notifications: NotificationItem[];
    chartData: {
        ventas: number[];
        labels: string[];
    };
    isLoading: boolean;
    error: string | null;
}

export const useDashboardData = () => {
    const [data, setData] = useState<DashboardData>({
        stats: mockStats,
        sales: [],
        products: [],
        notifications: [],
        chartData: { ventas: [], labels: [] },
        isLoading: true,
        error: null
    });

    // Simular carga de datos
    useEffect(() => {
        const loadData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true, error: null }));

                // Simular delay de API
                await new Promise(resolve => setTimeout(resolve, 1000));

                setData({
                    stats: mockStats,
                    sales: mockSales,
                    products: mockProducts,
                    notifications: mockNotifications,
                    chartData: mockChartData,
                    isLoading: false,
                    error: null
                });
            } catch (error) {
                setData(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Error al cargar los datos del dashboard'
                }));
            }
        };

        loadData();
    }, []);

    // Funciones para actualizar datos
    const refreshData = () => {
        setData(prev => ({ ...prev, isLoading: true }));
        // Aquí harías la llamada real a la API
        setTimeout(() => {
            setData(prev => ({ ...prev, isLoading: false }));
        }, 500);
    };

    const markNotificationAsRead = (id: string) => {
        setData(prev => ({
            ...prev,
            notifications: prev.notifications.map(notification =>
                notification.id === id
                    ? { ...notification, leida: true }
                    : notification
            )
        }));
    };

    const addNewSale = (sale: Omit<SaleData, 'id'>) => {
        const newSale: SaleData = {
            ...sale,
            id: Date.now().toString()
        };

        setData(prev => ({
            ...prev,
            sales: [newSale, ...prev.sales],
            stats: {
                ...prev.stats,
                ventasHoy: prev.stats.ventasHoy + 1,
                montoTotal: prev.stats.montoTotal + sale.monto,
                puntosOtorgados: prev.stats.puntosOtorgados + sale.puntosOtorgados
            }
        }));
    };

    return {
        ...data,
        refreshData,
        markNotificationAsRead,
        addNewSale
    };
};