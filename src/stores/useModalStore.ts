// src/stores/useModalStore.ts
import { create } from "zustand";

type ModalType = "confirmDelete" | "addRest" | "cupon" | "codigoPromocional" | "confirmacion-cupon" | "birthday-gift" | "cupon-puntos" | null;

interface ModalState {
  modalType: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  openModal: (type: ModalType) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
}));