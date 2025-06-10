// interfaces/dashboard.ts

export interface SaleData {
    id: string;
    cliente: string;
    monto: number;
    puntosOtorgados: number;
    fecha: Date;
    productos: string[];
    metodoPago: 'efectivo' | 'tarjeta' | 'digital';
}

export interface DashboardStats {
    ventasHoy: number;
    montoTotal: number;
    clientesAtendidos: number;
    puntosOtorgados: number;
    canjesPendientes: number;
    promedioVenta: number;
    crecimientoVentas: number; // porcentaje
    crecimientoClientes: number; // porcentaje
}

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string;
        fill?: boolean;
    }[];
}

export interface ProductoVendido {
    id: string;
    nombre: string;
    cantidad: number;
    monto: number;
    categoria: string;
}

export interface NotificationItem {
    id: string;
    tipo: 'canje' | 'venta' | 'sistema' | 'cliente';
    titulo: string;
    mensaje: string;
    fecha: Date;
    leida: boolean;
    prioridad: 'alta' | 'media' | 'baja';
}

export interface QuickAction {
    id: string;
    titulo: string;
    descripcion: string;
    icon: React.ReactNode;
    color: string;
    action: () => void;
}