import { create } from "zustand";
import { getUserById } from "@/api/usuariosFetch";
import { User } from "@/types/user";

interface UserStore {
    usuario: User | null;
    loading: boolean;
    error: string | null;
    fetchUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    usuario: null,
    loading: true,
    error: null,
    fetchUser: async (id: number) => {
        try {
            const user = await getUserById(id);
            set({ usuario: user, loading: false, error: null });
        } catch (error) {
            set({ loading: false, error: "Hubo un error al cargar el usuario." });
        }
    },
}));