export const RecentSalesSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)] animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-[var(--gray-200)] rounded w-1/3"></div>
                <div className="h-4 bg-[var(--gray-200)] rounded w-16"></div>
            </div>

            {/* Sales list */}
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg">
                        <div className="flex-1">
                            {/* Cliente */}
                            <div className="h-5 bg-[var(--gray-200)] rounded w-1/2 mb-2"></div>
                            {/* Productos + fecha */}
                            <div className="h-4 bg-[var(--gray-200)] rounded w-3/4"></div>
                        </div>
                        <div className="text-right mr-4">
                            {/* Monto */}
                            <div className="h-5 bg-[var(--gray-200)] rounded w-16 mb-1"></div>
                            {/* Puntos */}
                            <div className="h-4 bg-[var(--gray-200)] rounded w-14"></div>
                        </div>
                        {/* Badge método pago */}
                        <div className="w-16 h-6 bg-[var(--gray-200)] rounded-full"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};