// mocks/dashboardData.ts
import { DashboardStats, SaleData, ProductoVendido, NotificationItem } from '@/types/dashboard';

export const mockStats: DashboardStats = {
    ventasHoy: 28,
    montoTotal: 15750,
    clientesAtendidos: 23,
    puntosOtorgados: 4250,
    canjesPendientes: 3,
    promedioVenta: 562,
    crecimientoVentas: 12.5,
    crecimientoClientes: 8.3
};

export const mockSales: SaleData[] = [
    {
        id: '1',
        cliente: 'María González',
        monto: 850,
        puntosOtorgados: 85,
        fecha: new Date(Date.now() - 30 * 60 * 1000), // Hace 30 minutos
        productos: ['Bife de Chorizo', 'Ensalada César'],
        metodoPago: 'tarjeta'
    },
    {
        id: '2',
        cliente: 'Carlos Rodríguez',
        monto: 1200,
        puntosOtorgados: 120,
        fecha: new Date(Date.now() - 45 * 60 * 1000), // Hace 45 minutos
        productos: ['Parrillada para 2', 'Vino Malbec'],
        metodoPago: 'efectivo'
    },
    {
        id: '3',
        cliente: 'Ana Martín',
        monto: 650,
        puntosOtorgados: 65,
        fecha: new Date(Date.now() - 60 * 60 * 1000), // Hace 1 hora
        productos: ['Milanesa Napolitana', 'Papas Fritas'],
        metodoPago: 'digital'
    },
    {
        id: '4',
        cliente: 'Roberto Silva',
        monto: 920,
        puntosOtorgados: 92,
        fecha: new Date(Date.now() - 90 * 60 * 1000), // Hace 1.5 horas
        productos: ['Empanadas', 'Coca Cola', 'Flan'],
        metodoPago: 'tarjeta'
    },
    {
        id: '5',
        cliente: 'Laura Fernández',
        monto: 1450,
        puntosOtorgados: 145,
        fecha: new Date(Date.now() - 120 * 60 * 1000), // Hace 2 horas
        productos: ['Asado para 3', 'Ensalada Mixta', 'Vino Tinto'],
        metodoPago: 'efectivo'
    }
];

export const mockProducts: ProductoVendido[] = [
    {
        id: '1',
        nombre: 'Bife de Chorizo',
        cantidad: 15,
        monto: 12750,
        categoria: 'Carnes'
    },
    {
        id: '2',
        nombre: 'Milanesa Napolitana',
        cantidad: 12,
        monto: 7800,
        categoria: 'Milanesas'
    },
    {
        id: '3',
        nombre: 'Parrillada',
        cantidad: 8,
        monto: 9600,
        categoria: 'Parrilla'
    },
    {
        id: '4',
        nombre: 'Ensalada César',
        cantidad: 10,
        monto: 3000,
        categoria: 'Ensaladas'
    },
    {
        id: '5',
        nombre: 'Vino Malbec',
        cantidad: 6,
        monto: 4200,
        categoria: 'Bebidas'
    },
    {
        id: '6',
        nombre: 'Empanadas',
        cantidad: 18,
        monto: 5400,
        categoria: 'Entradas'
    }
];

export const mockNotifications: NotificationItem[] = [
    {
        id: '1',
        tipo: 'canje',
        titulo: 'Nuevo canje pendiente',
        mensaje: 'Cliente Juan Pérez quiere canjear 500 puntos por descuento',
        fecha: new Date(Date.now() - 15 * 60 * 1000), // Hace 15 minutos
        leida: false,
        prioridad: 'alta'
    },
    {
        id: '2',
        tipo: 'venta',
        titulo: 'Venta completada',
        mensaje: 'Se registró una venta por $1,200 a Carlos Rodríguez',
        fecha: new Date(Date.now() - 45 * 60 * 1000), // Hace 45 minutos
        leida: true,
        prioridad: 'media'
    },
    {
        id: '3',
        tipo: 'sistema',
        titulo: 'Actualización de menú',
        mensaje: 'Se actualizaron los precios del menú automáticamente',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
        leida: true,
        prioridad: 'baja'
    },
    {
        id: '4',
        tipo: 'cliente',
        titulo: 'Cliente nuevo adherido',
        mensaje: 'María González se adhirió al programa de puntos',
        fecha: new Date(Date.now() - 3 * 60 * 60 * 1000), // Hace 3 horas
        leida: false,
        prioridad: 'media'
    },
    {
        id: '5',
        tipo: 'canje',
        titulo: 'Canje completado',
        mensaje: 'Ana Martín canjeó 300 puntos por postre gratis',
        fecha: new Date(Date.now() - 4 * 60 * 60 * 1000), // Hace 4 horas
        leida: true,
        prioridad: 'baja'
    }
];

export const mockChartData = {
    ventas: [28, 32, 25, 38, 42, 35, 29], // Ventas por día de la semana
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
};