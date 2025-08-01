"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';
import Button from '../../components/ui/buttons/Button';
import Input from '../../components/ui/inputs/Input';
import { ProductoCard } from '../ProductoCard';
import { Search, Package, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Product as Producto } from '@/types/product';

export interface CuponModalStep2ProductosProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    onNext: (producto: Producto) => void;
    productos: Producto[];
    isLoading?: boolean;
}

export const CuponModalStep2Productos: React.FC<CuponModalStep2ProductosProps> = ({
    isOpen,
    onClose,
    onBack,
    onNext,
    productos,
    isLoading = false
}) => {
    const { isMounted, isClosing: hookIsClosing, handleClose } = useAnimatedModal(isOpen, onClose);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isClosing, setIsClosing] = useState(false);

    const PRODUCTOS_PER_PAGE = 6;

    const filteredProductos = useMemo(() => {
        if (!searchTerm.trim()) return productos;
        const search = searchTerm.toLowerCase().trim();
        return productos.filter(producto =>
            producto.pro_nom.toLowerCase().includes(search)
        );
    }, [productos, searchTerm]);

    const totalPages = Math.ceil(filteredProductos.length / PRODUCTOS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTOS_PER_PAGE;
    const currentProductos = filteredProductos.slice(startIndex, startIndex + PRODUCTOS_PER_PAGE);

    useEffect(() => setCurrentPage(1), [searchTerm]);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setSelectedProducto(null);
            setCurrentPage(1);
        }
    }, [isOpen]);

    const handleSelectProducto = (producto: Producto) => setSelectedProducto(producto);
    const handleContinuar = () => selectedProducto && onNext(selectedProducto);
    const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

    const effectiveIsClosing = isClosing || hookIsClosing;

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    if (!isOpen && !isMounted) return null;

    return (
        <div
            className={`fixed inset-0 z-9999 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"} ${effectiveIsClosing ? "backdrop-blur-none bg-black/0" : "backdrop-blur-sm bg-black/60"}`}
            onClick={onClose}
        >
            <div
                className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[95%] max-w-6xl max-h-[93vh] overflow-hidden shadow-xl transition-all duration-300 ${isMounted && !effectiveIsClosing ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between mb-4 transition-all duration-500 delay-100 ${isMounted && !effectiveIsClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--violet-200)] text-[var(--violet-600)] p-2 rounded-lg">
                            <Package size={24} />
                        </div>
                        <div>
                            <span className="bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg font-bold text-sm">
                                PASO 2
                            </span>
                            <h2 className="text-2xl font-bold mt-1">Selecciona un Producto</h2>
                        </div>
                    </div>

                    <button
                        className="text-[var(--white)] hover:scale-110 transition-transform active:scale-90 p-2"
                        onClick={onClose}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Buscador */}
                <div className={`mb-6 transition-all duration-500 delay-200 ${isMounted && !effectiveIsClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
                    <Input
                        placeholder="Buscar productos por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search size={16} />}
                        className="w-full"
                    />
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto pr-1" style={{ maxHeight: 'calc(90vh - 250px)' }}>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-[var(--violet-100)]" />
                            <span className="ml-2 text-[var(--violet-100)]">Cargando productos...</span>
                        </div>
                    ) : filteredProductos.length === 0 ? (
                        <div className="text-center py-16">
                            <Package size={48} className="mx-auto text-[var(--violet-300)] mb-4" />
                            <h3 className="text-lg font-semibold text-[var(--violet-100)] mb-2">
                                {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
                            </h3>
                            <p className="text-[var(--violet-300)] text-sm">
                                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Agrega productos para poder crear cupones'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-4 p-2 transition-all duration-500 delay-300 ${isMounted && !effectiveIsClosing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                                {currentProductos.map((producto) => (
                                    <ProductoCard
                                        key={producto.pro_id}
                                        producto={producto}
                                        onSelect={handleSelectProducto}
                                        isSelected={selectedProducto?.pro_id === producto.pro_id}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className={`flex items-center justify-between mb-4 transition-all duration-500 delay-400 ${isMounted && !effectiveIsClosing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                                    <Button onClick={handlePrevPage} disabled={currentPage === 1} className="flex items-center hover:text-[var(--violet-100)]">
                                        <ArrowLeft size={16} className="mr-1" /> Anterior
                                    </Button>
                                    <span className="text-sm text-[var(--violet-50)]">
                                        Página {currentPage} de {totalPages}
                                        <span className="ml-2 text-[var(--violet-50)]">
                                            ({filteredProductos.length} productos)
                                        </span>
                                    </span>
                                    <Button onClick={handleNextPage} disabled={currentPage === totalPages} className="flex items-center hover:text-[var(--violet-100)]">
                                        Siguiente <ArrowRight size={16} className="ml-1" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className={`flex justify-between items-center pt-6 border-t border-[var(--violet-300)] transition-all duration-500 delay-500 ${isMounted && !effectiveIsClosing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                    <Button
                        variant="outline"
                        onClick={onBack}
                        className="flex items-center border-gray-300 text-[var(--violet-100)] hover:bg-[var(--violet-500)]"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Volver
                    </Button>

                    <div className="flex items-center gap-3">
                        {selectedProducto && (
                            <div className="text-sm text-[var(--violet-100)] bg-[var(--violet-700)] px-3 py-2 rounded-lg">
                                ✅ <strong>{selectedProducto.pro_nom}</strong> seleccionado
                            </div>
                        )}
                        <Button
                            onClick={handleContinuar}
                            disabled={!selectedProducto}
                            className="flex items-center"
                            variant='light'
                        >
                            Continuar
                            <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
