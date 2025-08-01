import { Sucursal } from '@/types/sucursal';
import Image from 'next/image';

interface MarcaSliderItemProps {
    marca: Sucursal;
    className?: string;
}

export const MarcaSliderItem = ({ marca, className = '' }: MarcaSliderItemProps) => {
    return (
        <div className={`w-30 flex-shrink-0 px-2 ${className}`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center justify-center shadow-sm border border-white/60 hover:shadow-md hover:border-[var(--rose)] transition-all duration-200 min-h-[6rem]">
                <img
                    src={marca.suc_url_foto}
                    alt={marca.suc_nom}
                    className={`w-full h-auto min-h-20 object-contain transition-opacity duration-200`}
                />
            </div>
        </div>
    );
};