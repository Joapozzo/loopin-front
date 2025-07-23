import { create } from 'zustand';
import { CodigoPromocional } from '@/types/codigos';

interface CodigoPromocionalState {
    codigoPromocional: CodigoPromocional | null;
    setCodigoPromocional: (codigo: CodigoPromocional) => void;
    clearCodigoPromocional: () => void;
}

export const useCodigoPromocionalStore = create<CodigoPromocionalState>((set) => ({
    codigoPromocional: null,
    setCodigoPromocional: (codigo) => set({ codigoPromocional: codigo }),
    clearCodigoPromocional: () => set({ codigoPromocional: null }),
}));