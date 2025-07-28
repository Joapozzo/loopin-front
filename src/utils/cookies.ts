import { logger } from "./logger";

// utils/cookies.ts
export interface CookieOptions {
    expires?: Date;
    maxAge?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

export const cookieUtils = {
    // Establecer cookie
    set: (name: string, value: string, options: CookieOptions = {}) => {
        if (typeof document === 'undefined') return; // SSR safety

        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (options.expires) {
            cookieString += `; expires=${options.expires.toUTCString()}`;
        }

        if (options.maxAge) {
            cookieString += `; max-age=${options.maxAge}`;
        }

        if (options.path) {
            cookieString += `; path=${options.path}`;
        }

        if (options.domain) {
            cookieString += `; domain=${options.domain}`;
        }

        if (options.secure) {
            cookieString += `; secure`;
        }

        if (options.httpOnly) {
            cookieString += `; httponly`;
        }

        if (options.sameSite) {
            cookieString += `; samesite=${options.sameSite}`;
        }

        document.cookie = cookieString;
    },

    // Obtener cookie
    get: (name: string): string | null => {
        if (typeof document === 'undefined') return null; // SSR safety

        const nameEQ = `${encodeURIComponent(name)}=`;
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length));
            }
        }

        return null;
    },

    // Eliminar cookie
    remove: (name: string, options: Omit<CookieOptions, 'expires' | 'maxAge'> = {}) => {
        cookieUtils.set(name, '', {
            ...options,
            expires: new Date(0)
        });
    },

    // Verificar si existe una cookie
    exists: (name: string): boolean => {
        return cookieUtils.get(name) !== null;
    }
};

// Utilidades específicas para auth
export const authCookies = {
    TOKEN_KEY: 'auth_token',
    ROLE_KEY: 'user_role',
    PROFILE_KEY: 'user_profile',
    GOOGLE_USER_KEY: 'google_user',
    GOOGLE_EMAIL_KEY: 'google_email',

    // Configuración segura para cookies de auth
    getSecureOptions: (): CookieOptions => ({
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 días en segundos
    }),

    // Establecer token de autenticación
    setToken: (token: string) => {
        cookieUtils.set(authCookies.TOKEN_KEY, token, authCookies.getSecureOptions());
    },

    // Obtener token de autenticación
    getToken: (): string | null => {
        return cookieUtils.get(authCookies.TOKEN_KEY);
    },

    // Establecer rol del usuario
    setRole: (role: string) => {
        cookieUtils.set(authCookies.ROLE_KEY, role, authCookies.getSecureOptions());
    },

    // Obtener rol del usuario
    getRole: (): string | null => {
        return cookieUtils.get(authCookies.ROLE_KEY);
    },

    // Establecer perfil del usuario (como JSON string)
    setProfile: (profile: any) => {
        const profileJson = JSON.stringify(profile);
        cookieUtils.set(authCookies.PROFILE_KEY, profileJson, authCookies.getSecureOptions());
    },

    // Obtener perfil del usuario
    getProfile: (): any | null => {
        const profileJson = cookieUtils.get(authCookies.PROFILE_KEY);
        if (!profileJson) return null;

        try {
            return JSON.parse(profileJson);
        } catch (error) {
            logger.error('Error parsing profile from cookie:', error);
            return null;
        }
    },

    // Marcar como usuario de Google
    setGoogleUser: (email: string) => {
        cookieUtils.set(authCookies.GOOGLE_USER_KEY, 'true', authCookies.getSecureOptions());
        cookieUtils.set(authCookies.GOOGLE_EMAIL_KEY, email, authCookies.getSecureOptions());
    },

    // Verificar si es usuario de Google
    isGoogleUser: (): boolean => {
        return cookieUtils.get(authCookies.GOOGLE_USER_KEY) === 'true';
    },

    // Obtener email de Google
    getGoogleEmail: (): string | null => {
        return cookieUtils.get(authCookies.GOOGLE_EMAIL_KEY);
    },

    // Limpiar todas las cookies de auth
    clearAll: () => {
        const options = { path: '/' };
        cookieUtils.remove(authCookies.TOKEN_KEY, options);
        cookieUtils.remove(authCookies.ROLE_KEY, options);
        cookieUtils.remove(authCookies.PROFILE_KEY, options);
        cookieUtils.remove(authCookies.GOOGLE_USER_KEY, options);
        cookieUtils.remove(authCookies.GOOGLE_EMAIL_KEY, options);
    },

    // Cargar datos de auth desde cookies
    loadAuthData: () => {
        return {
            token: authCookies.getToken(),
            role: authCookies.getRole() as 'cliente' | 'encargado' | null,
            profile: authCookies.getProfile(),
            isGoogleUser: authCookies.isGoogleUser(),
            googleEmail: authCookies.getGoogleEmail()
        };
    },

    // Guardar datos completos de auth
    saveAuthData: (data: {
        token: string;
        role: 'cliente' | 'encargado';
        profile: any;
        isGoogleUser?: boolean;
        googleEmail?: string;
    }) => {
        authCookies.setToken(data.token);
        authCookies.setRole(data.role);
        authCookies.setProfile(data.profile);

        if (data.isGoogleUser && data.googleEmail) {
            authCookies.setGoogleUser(data.googleEmail);
        }
    }
};