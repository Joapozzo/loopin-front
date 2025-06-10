// src/store/useConfigStore.ts
import { create } from 'zustand';

interface ConfigState {
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
    isOpen: false,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));
