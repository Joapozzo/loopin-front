export const NotificationCenterSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)] animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-[var(--gray-200)] rounded w-1/3"></div>
                <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-[var(--gray-200)] rounded"></div>
                    <div className="h-4 bg-[var(--gray-200)] rounded w-16"></div>
                </div>
            </div>
            
            {/* Notifications list */}
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-3 border-l-4 border-l-[var(--gray-200)] bg-[var(--gray-100)]/50 rounded-r-lg">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2">
                                {/* Icono */}
                                <div className="w-4 h-4 bg-[var(--gray-200)] rounded flex-shrink-0 mt-0.5"></div>
                                <div className="flex-1">
                                    {/* Título */}
                                    <div className="h-4 bg-[var(--gray-200)] rounded w-3/4 mb-2"></div>
                                    {/* Mensaje */}
                                    <div className="h-3 bg-[var(--gray-200)] rounded w-full mb-2"></div>
                                    {/* Fecha */}
                                    <div className="h-3 bg-[var(--gray-200)] rounded w-1/4"></div>
                                </div>
                            </div>
                            {/* Punto de no leída */}
                            <div className="w-2 h-2 bg-[var(--gray-200)] rounded-full flex-shrink-0 mt-1"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};