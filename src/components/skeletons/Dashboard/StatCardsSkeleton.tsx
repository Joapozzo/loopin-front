export const StatCardsSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-[var(--gray-100)] animate-pulse">
                    <div className="w-12 h-12 bg-[var(--gray-200)] rounded-xl mb-4"></div>
                    <div className="h-8 bg-[var(--gray-200)] rounded mb-2"></div>
                    <div className="h-4 bg-[var(--gray-200)] rounded w-2/3"></div>
                </div>
            ))}
        </div>
    );
};