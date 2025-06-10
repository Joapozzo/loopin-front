// utils/formatters.ts

/**
 * Formatea un número como moneda argentina
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-AR').format(num);
};

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (num: number, decimals: number = 1): string => {
    return `${num.toFixed(decimals)}%`;
};

/**
 * Formatea una fecha relativa (hace X tiempo)
 */
export const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays}d`;

    return date.toLocaleDateString('es-AR');
};

/**
 * Formatea una fecha completa
 */
export const formatFullDate = (date: Date): string => {
    return date.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Formatea una hora
 */
export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Abrevia números grandes (1K, 1M, etc.)
 */
export const abbreviateNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

/**
 * Capitaliza la primera letra de una cadena
 */
export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Trunca texto con ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
};