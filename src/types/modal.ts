import { Product } from "./product";

export interface CuponModalStep1Props {
    isOpen: boolean;
    onClose: () => void;
    onSelectTipo: (tipo: 'promocion' | 'puntos') => void;
}

export interface CuponModalStep2ProductosProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    onNext: (productoId: number) => void;
    productos: Product[];
    isLoading?: boolean;
}

export interface CuponModalStep3PromocionProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    onSubmit: (data: CreateCuponPromocionFormData) => Promise<void>;
    productoSeleccionado: Product | null;
    isLoading?: boolean;
}

// Formulario final para crear cupón promocional
export interface CreateCuponPromocionFormData {
    pro_id: number;
    cod_prom_publico: string;
    cod_prom_fecha_expiracion: string;
    cod_prom_uso_max: number;
}

// Estados del modal
export type CuponModalState = 'none' | 'step1' | 'step2-productos' | 'step3-promocion' | 'step3-puntos';