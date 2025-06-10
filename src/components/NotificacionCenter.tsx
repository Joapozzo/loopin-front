// components/dashboard/NotificationCenter.tsx
import React from 'react';
import { Bell } from 'lucide-react';
import { NotificationItem } from '@/types/dashboard'; 

interface NotificationCenterProps {
    notifications: NotificationItem[];
    maxItems?: number;
    onMarkAsRead?: (id: string) => void;
    onViewAll?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
    notifications,
    maxItems = 4,
    onMarkAsRead,
    onViewAll
}) => {
    const getNotificationColor = (tipo: string, prioridad: string) => {
        if (prioridad === 'alta') return 'border-l-[var(--rose)]';
        switch (tipo) {
            case 'canje': return 'border-l-[var(--violet)]';
            case 'venta': return 'border-l-[var(--success)]';
            case 'sistema': return 'border-l-[var(--skyblue)]';
            default: return 'border-l-[var(--gray-300)]';
        }
    };

    const getNotificationIcon = (tipo: string) => {
        switch (tipo) {
            case 'canje': return '🎁';
            case 'venta': return '💰';
            case 'sistema': return '⚙️';
            case 'cliente': return '👤';
            default: return '📢';
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--black)]">Notificaciones</h3>
                <div className="flex items-center space-x-2">
                    <Bell size={20} className="text-[var(--gray-400)]" />
                    {onViewAll && (
                        <button
                            onClick={onViewAll}
                            className="text-[var(--violet)] hover:text-[var(--violet-200)] text-sm font-medium"
                        >
                            Ver todas
                        </button>
                    )}
                </div>
            </div>
            <div className="space-y-3">
                {notifications.slice(0, maxItems).map((notification) => (
                    <div
                        key={notification.id}
                        className={`p-3 border-l-4 ${getNotificationColor(notification.tipo, notification.prioridad)} bg-[var(--gray-100)]/50 rounded-r-lg cursor-pointer hover:bg-[var(--gray-100)] transition-colors`}
                        onClick={() => onMarkAsRead?.(notification.id)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2">
                                <span className="text-sm">{getNotificationIcon(notification.tipo)}</span>
                                <div className="flex-1">
                                    <p className="font-medium text-[var(--black)] text-sm">{notification.titulo}</p>
                                    <p className="text-xs text-[var(--gray-400)] mt-1">{notification.mensaje}</p>
                                    <p className="text-xs text-[var(--gray-300)] mt-2">
                                        {notification.fecha.toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            {!notification.leida && (
                                <div className="w-2 h-2 bg-[var(--violet)] rounded-full flex-shrink-0 mt-1"></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {notifications.length === 0 && (
                <div className="text-center py-8">
                    <Bell size={48} className="text-[var(--gray-300)] mx-auto mb-2" />
                    <p className="text-[var(--gray-400)]">No hay notificaciones nuevas</p>
                </div>
            )}
        </div>
    );
};