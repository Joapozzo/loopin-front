import { create } from 'zustand';
import { User, UserProfile } from 'firebase/auth';

type AuthState =
    | { type: 'LOADING' }
    | { type: 'UNAUTHENTICATED' }
    | { type: 'EMAIL_NOT_VERIFIED'; firebaseUser: User }
    | { type: 'NEEDS_ONBOARDING'; firebaseUser: User; token: string }
    | { type: 'AUTHENTICATED'; firebaseUser: User; token: string; role: 'cliente' | 'encargado'; profile: UserProfile };

interface AuthStore {
    // Estado
    state: AuthState;
    hasLoadedFromStorage: boolean;

    // Acciones
    setState: (state: AuthState) => void;
    setHasLoadedFromStorage: (loaded: boolean) => void;
    reset: () => void;

    // Getters derivados
    isLoading: () => boolean;
    isAuthenticated: () => boolean;
    needsOnboarding: () => boolean;
    emailNotVerified: () => boolean;
    getUser: () => User | null;
    getToken: () => string | null;
    getRole: () => 'cliente' | 'encargado' | null;
    getProfile: () => UserProfile | null;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    state: { type: 'LOADING' },
    hasLoadedFromStorage: false,

    setState: (state) => set({ state }),
    setHasLoadedFromStorage: (loaded) => set({ hasLoadedFromStorage: loaded }),
    reset: () => set({
        state: { type: 'UNAUTHENTICATED' },
        hasLoadedFromStorage: true
    }),

    // Getters
    isLoading: () => get().state.type === 'LOADING',
    isAuthenticated: () => get().state.type === 'AUTHENTICATED',
    needsOnboarding: () => get().state.type === 'NEEDS_ONBOARDING',
    emailNotVerified: () => get().state.type === 'EMAIL_NOT_VERIFIED',
    getUser: () => {
        const state = get().state;
        return state.type === 'UNAUTHENTICATED' || state.type === 'LOADING'
            ? null
            : state.firebaseUser;
    },
    getToken: () => {
        const state = get().state;
        return state.type === 'NEEDS_ONBOARDING' || state.type === 'AUTHENTICATED'
            ? state.token
            : null;
    },
    getRole: () => {
        const state = get().state;
        return state.type === 'AUTHENTICATED' ? state.role : null;
    },
    getProfile: () => {
        const state = get().state;
        return state.type === 'AUTHENTICATED' ? state.profile : null;
    }
}));