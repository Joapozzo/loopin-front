import { Marca } from '@/data/marcasSlider';
import { useState } from 'react';

interface MarcaSliderItemProps {
    marca: Marca;
    className?: string;
}

export const MarcaSliderItem = ({ marca, className = '' }: MarcaSliderItemProps) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        console.error(`Error loading logo for ${marca.nombre}: ${marca.logo}`);
        setImageError(true);
        setIsLoading(false);
    };

    return (
        <div className={`w-30 flex-shrink-0 px-2 ${className}`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center justify-center shadow-sm border border-white/60 hover:shadow-md hover:border-[var(--rose)] transition-all duration-200 min-h-[6rem]">
                {/* Loader mientras carga la imagen */}
                {isLoading && !imageError && (
                    <div className="w-full h-8 bg-gray-200 animate-pulse rounded"></div>
                )}
                
                {!imageError && (
                    <img
                        src={marca.logo}
                        alt={marca.nombre}
                        className={`w-full h-auto max-h-60 object-contain transition-opacity duration-200 ${
                            isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        title={marca.nombre}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                )}
                
                {/* Fallback si falla la imagen */}
                {imageError && (
                    <div className="text-xs font-bold text-gray-700 text-center px-1">
                        {marca.nombre}
                    </div>
                )}
            </div>
        </div>
    );
};