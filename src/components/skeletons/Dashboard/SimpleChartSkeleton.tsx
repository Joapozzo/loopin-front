export const SimpleChartsSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)] animate-pulse">
                    <div className="h-6 bg-[var(--gray-200)] rounded w-1/3 mb-4"></div>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {[65, 45, 80, 35, 70, 50, 90].map((height, j) => (
                            <div key={j} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-[var(--gray-200)] rounded-t-md"
                                    style={{ height: `${height}%`, minHeight: '8px' }}
                                />
                                <div className="w-8 h-3 bg-[var(--gray-200)] rounded mt-2"></div>
                                <div className="w-6 h-3 bg-[var(--gray-200)] rounded mt-1"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};