interface AuthCookieData {
    token: string;
    role?: 'cliente' | 'encargado' ;
    profile?: any;
    isGoogleUser?: boolean;
    userEmail?: string;
}

const COOKIE_OPTIONS = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 // 7 días
};

export const authCookies = {
    setAuthData(data: AuthCookieData) {
        try {
            if (typeof window !== 'undefined') {
                // Usar sessionStorage para evitar problemas de cookies en producción
                sessionStorage.setItem('auth_token', data.token);
                if (data.role) sessionStorage.setItem('auth_role', data.role);
                if (data.profile) sessionStorage.setItem('auth_profile', JSON.stringify(data.profile));
                if (data.isGoogleUser) sessionStorage.setItem('auth_is_google', 'true');
                if (data.userEmail) sessionStorage.setItem('auth_user_email', data.userEmail);
            }
        } catch (error) {
            console.error('Error guardando en sessionStorage:', error);
        }
    },

    getAuthData(): Partial<AuthCookieData> {
        try {
            if (typeof window !== 'undefined') {
                const token = sessionStorage.getItem('auth_token');
                const role = sessionStorage.getItem('auth_role') as 'cliente' | 'encargado' | null;
                const profileStr = sessionStorage.getItem('auth_profile');
                const isGoogleUser = sessionStorage.getItem('auth_is_google') === 'true';
                const userEmail = sessionStorage.getItem('auth_user_email');

                return {
                    token: token || undefined,
                    role: role || undefined,
                    profile: profileStr ? JSON.parse(profileStr) : undefined,
                    isGoogleUser,
                    userEmail: userEmail || undefined
                };
            }
        } catch (error) {
            console.error('Error leyendo sessionStorage:', error);
        }
        return {};
    },

    clearAuth() {
        try {
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_role');
                sessionStorage.removeItem('auth_profile');
                sessionStorage.removeItem('auth_is_google');
                sessionStorage.removeItem('auth_user_email');
            }
        } catch (error) {
            console.error('Error limpiando sessionStorage:', error);
        }
    }
};