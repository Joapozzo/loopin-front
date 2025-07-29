"use client";
import {
    createContext,
    useContext,
    useEffect,
    ReactNode,
} from "react";
import { auth } from "@/auth/firebase";
import { onAuthStateChanged, signOut, User, signInWithEmailAndPassword } from "firebase/auth";
import { getUserProfile } from "@/api/usuariosFetch"
import toast from "react-hot-toast";
import { logger } from "@/utils/logger";
import { useAuthStore } from "@/stores/userProfile";
import { authCookies } from "@/utils/cookies";

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

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    userRole: 'cliente' | 'encargado' | null;
    userProfile: UserProfile | null;
    isLoading: boolean;
    needsOnboarding: boolean;
    emailNotVerified: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    loginWithGoogle: (googleUser: User) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<string | null>;
    completeOnboarding: () => Promise<void>;
    hasLoadedFromStorage: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const {
        isAuthenticated,
        user,
        userRole,
        userProfile,
        isLoading,
        needsOnboarding,
        emailNotVerified,
        hasLoadedFromStorage,
        isExplicitLogin,
        isGoogleLogin,
        setUser,
        setUserRole,
        setUserProfile,
        setIsLoading,
        setNeedsOnboarding,
        setEmailNotVerified,
        setIsAuthenticated,
        setHasLoadedFromStorage,
        setIsExplicitLogin,
        setIsGoogleLogin,
        loginSuccess,
        loginForOnboarding,
        emailNotVerifiedState,
        logout: storeLogout,
        getIsFullyAuthenticated
    } = useAuthStore();

    const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;

    const validateUserRole = async (
        firebaseToken: string
    ): Promise<"cliente" | "encargado" | "needs_onboarding" | null> => {
        try {
            // Intentar validar como cliente primero
            const clienteResponse = await fetch(
                `${URI_API}/usuarios/validate_cliente`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${firebaseToken}`,
                    },
                }
            );

            if (clienteResponse.ok) {
                const data = await clienteResponse.json();
                if (data === true) {
                    return "cliente";
                }
            }

            // Si falla como cliente, intentar como encargado
            const encargadoResponse = await fetch(
                `${URI_API}/usuarios/validate_encargado`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${firebaseToken}`,
                    },
                }
            );

            if (encargadoResponse.ok) {
                const data = await encargadoResponse.json();
                if (data === true) {
                    return "encargado";
                }
            }

            // Si ambas APIs devuelven 200 pero con false, necesita onboarding
            if (clienteResponse.status === 200 && encargadoResponse.status === 200) {
                logger.log("🔄 Usuario existe en Firebase pero no en BD - needs_onboarding");
                return "needs_onboarding";
            }

            // Si hay otros códigos de error (403, 401, etc.), no tiene acceso válido
            logger.log("❌ No tiene acceso válido - retornando null");
            return null;
        } catch (error) {
            logger.error("❌ Error validando rol del usuario:", error);
            return null;
        }
    };

    const validateUserSession = async (firebaseUser: User): Promise<boolean> => {
        try {
            // PASO 0: VERIFICAR EMAIL ANTES QUE NADA
            if (!firebaseUser.emailVerified) {
                logger.log("❌ Email no verificado para usuario:", firebaseUser.email);
                emailNotVerifiedState(firebaseUser);
                return false;
            }

            // Paso 1: Obtener token de Firebase
            const firebaseToken = await firebaseUser.getIdToken();

            // Paso 2: Validar rol del usuario
            const roleOrStatus = await validateUserRole(firebaseToken);

            // Si necesita onboarding, configurar estado especial
            if (roleOrStatus === "needs_onboarding") {
                logger.log("🆕 Usuario nuevo detectado - configurando para onboarding");

                // Guardar token en cookie para onboarding
                authCookies.setToken(firebaseToken);

                loginForOnboarding(firebaseUser);
                return true;
            }

            // Si no tiene rol válido, fallar
            if (!roleOrStatus || roleOrStatus === null) {
                logger.log("❌ Usuario sin rol válido");
                return false;
            }

            // Obtener perfil del usuario
            const profileResponse = await getUserProfile(firebaseToken);
            if (!profileResponse.ok) {
                logger.error("❌ Error obteniendo perfil:", profileResponse.data);
                return false;
            }

            // Guardar en cookies
            authCookies.saveAuthData({
                token: firebaseToken,
                role: roleOrStatus,
                profile: profileResponse.data
            });

            // Actualizar store
            loginSuccess(firebaseUser, roleOrStatus, profileResponse.data);

            logger.log(`✅ Usuario completamente autenticado como: ${roleOrStatus}`);
            return true;
        } catch (error) {
            logger.error("❌ Error en validación de sesión:", error);
            return false;
        }
    };

    const completeOnboarding = async () => {
        logger.log("🎉 Completando onboarding...");

        if (user) {
            const isValid = await validateUserSession(user);
            if (!isValid) {
                logger.log("❌ Error revalidando después de onboarding");
                await signOut(auth);
            }
        }

        setNeedsOnboarding(false);
    };

    const loginWithGoogle = async (googleUser: User): Promise<boolean> => {
        try {
            logger.log("🔐 Iniciando login con Google para:", googleUser.email);
            setIsGoogleLogin(true);

            // VERIFICACIÓN DE EMAIL PARA GOOGLE TAMBIÉN
            if (!googleUser.emailVerified) {
                logger.log("❌ Email de Google no verificado (raro, pero posible)");
                emailNotVerifiedState(googleUser);
                setIsGoogleLogin(false);
                return false;
            }

            // Obtener token de Firebase del usuario de Google
            const firebaseToken = await googleUser.getIdToken();

            // Validar rol del usuario en nuestro sistema
            const roleOrStatus = await validateUserRole(firebaseToken);

            // Si necesita onboarding, configurar estado especial
            if (roleOrStatus === "needs_onboarding" || roleOrStatus === null) {
                logger.log("🔄 Usuario de Google con email verificado necesita onboarding");

                // Guardar en cookies con flag de Google
                authCookies.setToken(firebaseToken);
                authCookies.setGoogleUser(googleUser.email || "");

                loginForOnboarding(googleUser);
                setIsGoogleLogin(false);

                logger.log("✅ Google login configurado para onboarding");
                return true;
            }

            // Usuario existente con rol válido
            const profileResponse = await getUserProfile(firebaseToken);
            if (!profileResponse.ok) {
                logger.error("❌ Error obteniendo perfil para usuario de Google:", profileResponse.data);
                setIsGoogleLogin(false);
                return false;
            }

            // Guardar en cookies con flag de Google
            authCookies.saveAuthData({
                token: firebaseToken,
                role: roleOrStatus,
                profile: profileResponse.data,
                isGoogleUser: true,
                googleEmail: googleUser.email || ""
            });

            // Actualizar store
            loginSuccess(googleUser, roleOrStatus, profileResponse.data);
            setIsGoogleLogin(false);

            logger.log(`✅ Usuario de Google autenticado como: ${roleOrStatus}`);
            return true;

        } catch (error) {
            logger.error("❌ Error en login con Google:", error);
            setIsGoogleLogin(false);
            throw error;
        }
    };

    // Cargar datos desde cookies al inicializar
    useEffect(() => {
        const loadFromCookies = () => {
            const authData = authCookies.loadAuthData();

            if (authData.token) {
                try {
                    if (authData.role && authData.profile) {
                        // Datos completos - usuario autenticado
                        setUserRole(authData.role);
                        setUserProfile(authData.profile);
                        setNeedsOnboarding(false);
                        setEmailNotVerified(false);
                        setIsAuthenticated(true);

                        logger.log("✅ Datos de auth cargados desde cookies");
                    } else {
                        // Solo token - usuario en onboarding
                        setNeedsOnboarding(true);
                        setUserRole(null);
                        setUserProfile(null);
                        setIsAuthenticated(false);

                        logger.log("🔄 Token encontrado, usuario en onboarding");
                    }

                    setHasLoadedFromStorage(true);
                } catch (error) {
                    logger.error("❌ Error cargando datos desde cookies:", error);
                    authCookies.clearAll();
                    setHasLoadedFromStorage(true);
                }
            } else {
                logger.log("📦 No hay datos en cookies");
                setHasLoadedFromStorage(true);
            }
        };

        loadFromCookies();
    }, []);

    // onAuthStateChanged CONTROLADO Y INTELIGENTE
    useEffect(() => {
        // No iniciar hasta que hayamos cargado desde cookies
        if (!hasLoadedFromStorage) {
            logger.log("⏳ Esperando carga desde cookies...");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            logger.log("🔍 onAuthStateChanged triggered");
            logger.log("🎯 isGoogleLogin:", isGoogleLogin);
            logger.log("🎯 user:", firebaseUser?.email);
            logger.log("🎯 emailVerified:", firebaseUser?.emailVerified);

            // Si es un login de Google activo, COMPLETAMENTE SALTEADO
            if (isGoogleLogin) {
                logger.log("⏭️ SALTEANDO onAuthStateChanged - es Google login activo");
                return;
            }

            if (firebaseUser) {
                logger.log("🔍 Usuario detectado en Firebase:", firebaseUser.email);

                // Verificar si este usuario coincide con el Google user guardado
                const isGoogleUser = authCookies.isGoogleUser();
                const googleUserEmail = authCookies.getGoogleEmail();
                const hasCompleteSession = getIsFullyAuthenticated();

                // Si es Google user y ya tenemos sesión completa, verificar email match
                if (hasCompleteSession && isGoogleUser && googleUserEmail === firebaseUser.email) {
                    logger.log("✅ Usuario de Google con sesión completa y email coincidente, omitiendo revalidación");
                    setUser(firebaseUser);
                    setIsLoading(false);
                    return;
                }

                // Si tenemos token pero estamos en onboarding y es mismo Google user
                if (authCookies.getToken() && needsOnboarding && isGoogleUser && googleUserEmail === firebaseUser.email) {
                    logger.log("🔄 Usuario de Google en onboarding con email coincidente, omitiendo revalidación");
                    setUser(firebaseUser);
                    setIsLoading(false);
                    return;
                }

                // Solo revalidar si no tenemos datos o si no es usuario de Google o si el email no coincide
                if (!hasCompleteSession && (!isGoogleUser || googleUserEmail !== firebaseUser.email)) {
                    logger.log("✅ Procediendo con validación de sesión completa");
                    const isValid = await validateUserSession(firebaseUser);
                    if (!isValid) {
                        logger.log("❌ Validación fallida, cerrando sesión");
                        await signOut(auth);
                    }
                } else {
                    // Ya tenemos datos válidos, solo actualizar user
                    setUser(firebaseUser);
                }
            } else {
                // Usuario no autenticado, limpiar todo SOLO si no tenemos flag de Google
                const isGoogleUser = authCookies.isGoogleUser();

                if (!isGoogleUser) {
                    logger.log("🚪 Usuario desautenticado");
                    authCookies.clearAll();
                    storeLogout();
                } else {
                    logger.log("🔒 Usuario de Google sin Firebase user, manteniendo datos de cookies");
                }
            }

            setIsLoading(false);
            setIsExplicitLogin(false);
        });

        return () => unsubscribe();
    }, [hasLoadedFromStorage, isGoogleLogin, getIsFullyAuthenticated, needsOnboarding]);

    // Función de login que maneja todo el flujo
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            logger.log("🔐 Iniciando login explícito para:", email);
            setIsExplicitLogin(true);

            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            logger.error("❌ Error en login:", error);
            setIsExplicitLogin(false);
            throw error;
        }
    };

    const logout = async () => {
        const toastId = toast.loading("Cerrando sesión...");

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await signOut(auth);
            authCookies.clearAll();
            storeLogout();

            toast.success("Sesión cerrada correctamente", { id: toastId });

            window.location.href = "/login";
        } catch (error) {
            logger.error("❌ Error en logout:", error);

            authCookies.clearAll();
            storeLogout();

            toast.error("Error al cerrar sesión", { id: toastId });
        }
    };

    const refreshToken = async (): Promise<string | null> => {
        if (user) {
            try {
                const newToken = await user.getIdToken(true);
                const roleOrStatus = await validateUserRole(newToken);

                if (!roleOrStatus || roleOrStatus === "needs_onboarding") {
                    await logout();
                    return null;
                }

                // Actualizar cookie y store
                authCookies.setToken(newToken);
                authCookies.setRole(roleOrStatus);

                return newToken;
            } catch (error) {
                logger.error("❌ Error refrescando token:", error);
                return null;
            }
        }
        return null;
    };

    // Obtener token actual
    const getToken = (): string | null => {
        return authCookies.getToken();
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: getIsFullyAuthenticated(),
                token: getToken(),
                user,
                userRole,
                userProfile,
                isLoading,
                needsOnboarding,
                emailNotVerified,
                login,
                loginWithGoogle,
                logout,
                refreshToken,
                completeOnboarding,
                hasLoadedFromStorage
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthContext must be used within AuthContext");
    return context;
};