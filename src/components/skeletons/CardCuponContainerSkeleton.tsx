import CardCuponSkeleton from './CardCuponSkeleton';

export default function CardCuponContainerSkeleton() {
    return (
        <div className="w-full">
            <div className="md:hidden flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-shrink-0 w-72 snap-start">
                        <CardCuponSkeleton />
                    </div>
                ))}
            </div>

            <div className="hidden md:grid md:grid-cols-3 gap-4 w-full">
                {[1, 2, 3].map((i) => (
                    <CardCuponSkeleton key={i} />
                ))}
            </div>

            {/* Estilos CSS para ocultar scrollbar */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* Internet Explorer 10+ */
                    scrollbar-width: none;  /* Firefox */
                }
                .scrollbar-hide::-webkit-scrollbar { 
                    display: none;  /* Safari and Chrome */
                }
            `}</style>
        </div>
    );
}