"use client";
import { createContext, useContext, useEffect, ReactNode } from "react";
import { auth, googleProvider } from "@/auth/firebase";
import {
    onAuthStateChanged,
    signOut,
    User,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendEmailVerification
} from "firebase/auth";
import { getUserProfile, validateUser } from "@/api/usuariosFetch";
import toast from "react-hot-toast";
import { logger } from "@/utils/logger";
import { useAuthStore } from "@/stores/useAuthStore";
import { authCookies } from "@/utils/authCookies";
import { useRouter } from "next/navigation";

interface AuthContextType {
    // Estados derivados del store
    isLoading: boolean;
    isAuthenticated: boolean;
    needsOnboarding: boolean;
    emailNotVerified: boolean;
    user: User | null;
    token: string | null;
    userRole: 'cliente' | 'encargado' | null;
    userProfile: any;
    hasLoadedFromStorage: boolean;

    // Métodos
    login: (email: string, password: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<boolean>;
    logout: () => Promise<void>;
    completeOnboarding: () => Promise<void>;
    resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const store = useAuthStore();
    const router = useRouter();

    const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;

    // ============================================================================
    // FUNCIONES DE VALIDACIÓN
    // ============================================================================

    /**
     * Validar si el usuario existe en nuestra base de datos usando /usuarios/ver_perfil
     */
    const validateUserInDB = async (token: string) => {
        try {
            logger.log("🔍 Validando usuario en BD con /usuarios/validate...");

            const response = await validateUser(token);

            logger.log("📥 Respuesta de validateUser:", {
                status: response.status,
                ok: response.ok,
                data: response.data
            });

            if (response.ok) {
                const data = response.data;

                // 🔍 Verificar si el usuario existe
                if (data === true || (typeof data === 'object' && data.exists === true)) {
                    logger.log("✅ Usuario existe en BD - AHORA VALIDAR ROLES");

                    // 🎯 VALIDAR ROLES con los endpoints correctos
                    const roleValidation = await validateUserRole(token);

                    if (roleValidation) {
                        logger.log(`✅ Rol validado correctamente: ${roleValidation}`);

                        // Obtener perfil completo
                        const profileResponse = await getUserProfile(token);
                        const profile = profileResponse.ok ? profileResponse.data : null;

                        return { exists: true, role: roleValidation, profile };
                    } else {
                        logger.log("❌ Error validando rol del usuario");
                        return { exists: false, role: null, profile: null };
                    }

                } else {
                    logger.log("❌ Usuario no existe en BD - NECESITA ONBOARDING");
                    return { exists: false, role: null, profile: null };
                }

            } else {
                logger.log("❌ Error en API validate - NECESITA ONBOARDING");
                return { exists: false, role: null, profile: null };
            }
        } catch (error) {
            logger.error("❌ Error validando usuario:", error);
            return { exists: false, role: null, profile: null };
        }
    };

    /**
     * Validar rol específico del usuario usando los endpoints correctos
     */
    const validateUserRole = async (token: string): Promise<"cliente" | "encargado" | null> => {
        try {
            logger.log("🔍 Validando rol del usuario...");

            // 1. Intentar validar como CLIENTE primero
            logger.log("👤 Probando como CLIENTE...");
            const clienteResponse = await fetch(`${URI_API}/usuarios/validate_cliente`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const clienteData = await clienteResponse.json();
            if (clienteData) {
                logger.log("✅ CLIENTE validado exitosamente:", clienteData);
                return "cliente";
            }

            logger.log("❌ No es cliente, probando como ENCARGADO...");

            // 2. Si no es cliente, intentar validar como ENCARGADO
            const encargadoResponse = await fetch(`${URI_API}/usuarios/validate_encargado`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const encargadoData = await encargadoResponse.json();
            if (encargadoData) {
                logger.log("✅ ENCARGADO validado exitosamente:", encargadoData);
                return "encargado";
            }

            logger.log("❌ Usuario no es ni cliente ni encargado");
            return null;

        } catch (error) {
            logger.error("❌ Error validando rol:", error);
            return null;
        }
    };

    /**
     * Procesar usuario de Firebase después del login
     */
    const processFirebaseUser = async (firebaseUser: User) => {
        try {
            logger.log("🔄 Procesando usuario de Firebase:", firebaseUser.email);

            // 1. Verificar email
            if (!firebaseUser.emailVerified) {
                logger.log("❌ Email no verificado");
                store.setState({
                    type: 'EMAIL_NOT_VERIFIED',
                    firebaseUser
                });
                return;
            }

            // 2. Obtener token
            const token = await firebaseUser.getIdToken();
            logger.log("🔑 Token obtenido de Firebase");

            // 3. Validar en BD
            logger.log("🔍 Consultando usuario en base de datos...");
            const validation = await validateUserInDB(token);

            // 🔍 DEBUG EXTENDIDO
            logger.log("🎯 Resultado de validación:", {
                exists: validation.exists,
                role: validation.role,
                hasProfile: !!validation.profile
            });

            if (validation.exists && validation.role && validation.profile) {
                // ✅ Usuario COMPLETO - existe en BD con perfil
                logger.log("✅ Usuario completamente autenticado");
                logger.log(`👤 Rol FINAL: ${validation.role}`);

                // Guardar en storage
                authCookies.setAuthData({
                    token,
                    role: validation.role as 'cliente' | 'encargado',
                    profile: validation.profile,
                    userEmail: firebaseUser.email || ''
                });

                // 🔍 VERIFICAR QUE SE GUARDÓ CORRECTAMENTE
                const savedData = authCookies.getAuthData();
                logger.log("🔍 Datos guardados en cookies:", {
                    role: savedData.role,
                    userEmail: savedData.userEmail,
                    hasProfile: !!savedData.profile
                });

                store.setState({
                    type: 'AUTHENTICATED',
                    firebaseUser,
                    token,
                    role: validation.role as 'cliente' | 'encargado',
                    profile: validation.profile
                });

                // 🔍 VERIFICAR ESTADO DEL STORE
                logger.log("🔍 Estado final del store:", {
                    isAuthenticated: store.isAuthenticated(),
                    role: store.getRole(),
                    needsOnboarding: store.needsOnboarding()
                });

            } else {
                // ❌ Usuario NO existe en BD - NECESITA ONBOARDING
                logger.log("🔄 Usuario necesita onboarding obligatorio");
                logger.log("📝 Guardando token para proceso de onboarding");

                // Guardar solo token para onboarding
                authCookies.setAuthData({
                    token,
                    userEmail: firebaseUser.email || ''
                });

                store.setState({
                    type: 'NEEDS_ONBOARDING',
                    firebaseUser,
                    token
                });
            }
        } catch (error) {
            logger.error("❌ Error procesando usuario:", error);
            store.setState({ type: 'UNAUTHENTICATED' });
        }
    };

    // ============================================================================
    // MÉTODOS PÚBLICOS
    // ============================================================================

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            logger.log("🔐 Iniciando login con email/password");

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await processFirebaseUser(userCredential.user);

            return true;
        } catch (error: any) {
            logger.error("❌ Error en login:", error);
            throw error;
        }
    };

    const loginWithGoogle = async (): Promise<boolean> => {
        try {
            logger.log("🔐 Iniciando login con Google");

            googleProvider.addScope('email');
            googleProvider.addScope('profile');

            const result = await signInWithPopup(auth, googleProvider);

            // Marcar como Google user
            authCookies.setAuthData({
                token: '', // Se actualizará en processFirebaseUser
                isGoogleUser: true,
                userEmail: result.user.email || ''
            });

            await processFirebaseUser(result.user);

            return true;
        } catch (error: any) {
            logger.error("❌ Error en login con Google:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const toastId = toast.loading("Cerrando sesión...");
            logger.log("🚪 Cerrando sesión");

            // 1. Limpiamos todo
            await signOut(auth);
            authCookies.clearAuth();
            store.reset();

            // 2. Mostramos el toast de éxito
            toast.success("Cierre de sesión exitoso", { id: toastId });

            // 3. Esperamos un poco para que el usuario lo vea
            setTimeout(() => {
                router.push("/login");
            }, 2000); // ⏱️ Podés ajustar este delay si hace falta

        } catch (error) {
            logger.error("❌ Error en logout:", error);

            // 4. Siempre limpiamos aunque haya error
            authCookies.clearAuth();
            store.reset();

            toast.error("Error al cerrar sesión. Redirigiendo...", { duration: 2000 });

            // 5. Redirigimos igual (con pequeño delay opcional)
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        }
    };

    const completeOnboarding = async () => {
        try {
            logger.log("🎉 Completando onboarding");

            const user = store.getUser();
            if (user) {
                await processFirebaseUser(user);
            }
        } catch (error) {
            logger.error("❌ Error completando onboarding:", error);
        }
    };

    const resendVerificationEmail = async () => {
        try {
            const user = store.getUser();
            if (user) {
                await sendEmailVerification(user, {
                    url: `${window.location.origin}/login`,
                    handleCodeInApp: false
                });
                toast.success("Email de verificación reenviado");
            }
        } catch (error) {
            logger.error("❌ Error reenviando email:", error);
            toast.error("Error al reenviar email");
        }
    };

    // ============================================================================
    // EFFECTS
    // ============================================================================

    // Cargar datos iniciales desde storage
    useEffect(() => {
        const loadInitialData = () => {
            try {
                logger.log("📦 Cargando datos iniciales...");

                const savedData = authCookies.getAuthData();

                if (savedData.token) {
                    if (savedData.role && savedData.profile) {
                        // Datos completos - usuario autenticado
                        logger.log("✅ Datos completos encontrados en storage");
                        // No seteamos el estado aún, esperamos a onAuthStateChanged
                    } else {
                        // Solo token - usuario en onboarding
                        logger.log("🔄 Token encontrado - usuario en onboarding");
                        // No seteamos el estado aún, esperamos a onAuthStateChanged
                    }
                } else {
                    logger.log("❌ No hay datos en storage");
                    store.setState({ type: 'UNAUTHENTICATED' });
                }
            } catch (error) {
                logger.error("❌ Error cargando datos iniciales:", error);
                authCookies.clearAuth();
                store.setState({ type: 'UNAUTHENTICATED' });
            } finally {
                store.setHasLoadedFromStorage(true);
            }
        };

        loadInitialData();
    }, []);


    useEffect(() => {
        if (!store.hasLoadedFromStorage) {
            return;
        }

        logger.log("🔄 Iniciando listener de Firebase Auth");

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            logger.log("🔍 onAuthStateChanged:", firebaseUser?.email || 'null');

            if (firebaseUser) {
                // Verificar si ya tenemos datos válidos para este usuario
                const savedData = authCookies.getAuthData();
                const isLoadingFromExistingData =
                    savedData.userEmail === firebaseUser.email &&
                    (store.isAuthenticated() || store.needsOnboarding());

                if (!isLoadingFromExistingData) {
                    // Procesar usuario si no tenemos datos válidos
                    await processFirebaseUser(firebaseUser);
                } else {
                    // Restaurar estado desde storage
                    if (savedData.role && savedData.profile && savedData.token) {
                        store.setState({
                            type: 'AUTHENTICATED',
                            firebaseUser,
                            token: savedData.token,
                            role: savedData.role,
                            profile: savedData.profile
                        });
                    } else if (savedData.token) {
                        store.setState({
                            type: 'NEEDS_ONBOARDING',
                            firebaseUser,
                            token: savedData.token
                        });
                    }
                }
            } else {
                // Usuario no autenticado
                logger.log("❌ Usuario no autenticado en Firebase");
                authCookies.clearAuth();
                store.setState({ type: 'UNAUTHENTICATED' });
            }
        });

        return () => unsubscribe();
    }, [store.hasLoadedFromStorage]);

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const contextValue: AuthContextType = {
        // Estados
        isLoading: store.isLoading(),
        isAuthenticated: store.isAuthenticated(),
        needsOnboarding: store.needsOnboarding(),
        emailNotVerified: store.emailNotVerified(),
        user: store.getUser(),
        token: store.getToken(),
        userRole: store.getRole(),
        userProfile: store.getProfile(),
        hasLoadedFromStorage: store.hasLoadedFromStorage,

        // Métodos
        login,
        loginWithGoogle,
        logout,
        completeOnboarding,
        resendVerificationEmail
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};