import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { User } from 'firebase/auth';

interface UserProfile {
    usuario: {
        usu_id: string;
        usu_activo: number;
        usu_username: string;
        usu_mail: string;
        usu_cel: string;
        usu_fecha_alta: string;
        usu_fecha_baja: string;
        usu_fecha_ultimo_login: string;
        usu_login_count: number;
        usu_dni: string;
        usu_loc_id: number;
        tip_id: number;
    };
    mensaje: string;
}

interface AuthState {
    // Estados principales
    isAuthenticated: boolean;
    user: User | null;
    userRole: 'cliente' | 'encargado' | null;
    userProfile: UserProfile | null;
    isLoading: boolean;
    needsOnboarding: boolean;
    emailNotVerified: boolean;

    // Estados auxiliares
    hasLoadedFromStorage: boolean;
    isExplicitLogin: boolean;
    isGoogleLogin: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setUserRole: (role: 'cliente' | 'encargado' | null) => void;
    setUserProfile: (profile: UserProfile | null) => void;
    setIsLoading: (loading: boolean) => void;
    setNeedsOnboarding: (needs: boolean) => void;
    setEmailNotVerified: (notVerified: boolean) => void;
    setIsAuthenticated: (authenticated: boolean) => void;
    setHasLoadedFromStorage: (loaded: boolean) => void;
    setIsExplicitLogin: (explicit: boolean) => void;
    setIsGoogleLogin: (google: boolean) => void;

    // Computed states
    getIsFullyAuthenticated: () => boolean;

    // Complex actions
    loginSuccess: (user: User, role: 'cliente' | 'encargado', profile: UserProfile) => void;
    loginForOnboarding: (user: User) => void;
    emailNotVerifiedState: (user: User) => void;
    logout: () => void;
    reset: () => void;
}

export const useAuthStore = create<AuthState>()(
    subscribeWithSelector((set, get) => ({
        // Estados iniciales
        isAuthenticated: false,
        user: null,
        userRole: null,
        userProfile: null,
        isLoading: true,
        needsOnboarding: false,
        emailNotVerified: false,
        hasLoadedFromStorage: false,
        isExplicitLogin: false,
        isGoogleLogin: false,

        // Setters básicos
        setUser: (user) => set({ user }),
        setUserRole: (role) => set({ userRole: role }),
        setUserProfile: (profile) => set({ userProfile: profile }),
        setIsLoading: (loading) => set({ isLoading: loading }),
        setNeedsOnboarding: (needs) => set({ needsOnboarding: needs }),
        setEmailNotVerified: (notVerified) => set({ emailNotVerified: notVerified }),
        setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
        setHasLoadedFromStorage: (loaded) => set({ hasLoadedFromStorage: loaded }),
        setIsExplicitLogin: (explicit) => set({ isExplicitLogin: explicit }),
        setIsGoogleLogin: (google) => set({ isGoogleLogin: google }),

        // Computed state
        getIsFullyAuthenticated: () => {
            const state = get();
            return state.isAuthenticated &&
                !!state.user &&
                !!state.userRole &&
                !state.needsOnboarding &&
                !state.emailNotVerified;
        },

        // Actions complejas
        loginSuccess: (user, role, profile) => set({
            isAuthenticated: true,
            user,
            userRole: role,
            userProfile: profile,
            needsOnboarding: false,
            emailNotVerified: false,
            isLoading: false
        }),

        loginForOnboarding: (user) => set({
            isAuthenticated: false, // No completamente autenticado hasta completar onboarding
            user,
            userRole: null,
            userProfile: null,
            needsOnboarding: true,
            emailNotVerified: false,
            isLoading: false
        }),

        emailNotVerifiedState: (user) => set({
            isAuthenticated: false,
            user,
            userRole: null,
            userProfile: null,
            needsOnboarding: false,
            emailNotVerified: true,
            isLoading: false
        }),

        logout: () => set({
            isAuthenticated: false,
            user: null,
            userRole: null,
            userProfile: null,
            needsOnboarding: false,
            emailNotVerified: false,
            isLoading: false,
            hasLoadedFromStorage: true, // Mantener para evitar re-carga
            isExplicitLogin: false,
            isGoogleLogin: false
        }),

        reset: () => set({
            isAuthenticated: false,
            user: null,
            userRole: null,
            userProfile: null,
            isLoading: true,
            needsOnboarding: false,
            emailNotVerified: false,
            hasLoadedFromStorage: false,
            isExplicitLogin: false,
            isGoogleLogin: false
        })
    }))
);