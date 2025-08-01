"use client";
import { createContext, useContext, useEffect, ReactNode, useRef, useCallback } from "react";
import { auth, googleProvider } from "@/auth/firebase";
import {
    onAuthStateChanged,
    signOut,
    User,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendEmailVerification
} from "firebase/auth";
import { countLogin, getUserProfile, validateUser } from "@/api/usuariosFetch";
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

    // 🆕 CACHÉ PERSISTENTE USANDO useRef (NO SE RECREA EN CADA RENDER)
    const validationCacheRef = useRef(new Map<string, {
        result: any;
        timestamp: number;
        expiry: number;
    }>());

    // 🆕 FLAG PARA EVITAR PROCESAMIENTO MÚLTIPLE
    const processingUsersRef = useRef(new Set<string>());

    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    // 🆕 MÉTODOS PARA MANEJAR CACHÉ (MEMOIZADOS)
    const getCachedValidation = useCallback((key: string) => {
        const cached = validationCacheRef.current.get(key);
        if (cached && Date.now() < cached.timestamp + cached.expiry) {
            logger.log(`📦 Usando caché para: ${key}`);
            return cached.result;
        }
        return null;
    }, []);

    const setCachedValidation = useCallback((key: string, result: any) => {
        validationCacheRef.current.set(key, {
            result,
            timestamp: Date.now(),
            expiry: CACHE_DURATION
        });
    }, []);

    // ============================================================================
    // FUNCIONES DE VALIDACIÓN (CON CACHÉ PERSISTENTE)
    // ============================================================================

    /**
     * Validar rol específico del usuario usando los endpoints correctos (CON CACHÉ)
     */
    const validateUserRole = useCallback(async (token: string): Promise<"cliente" | "encargado" | null> => {
        const cacheKey = `validate_role_${token.slice(-10)}`;

        // 🔍 Verificar caché primero
        const cached = getCachedValidation(cacheKey);
        if (cached !== null) {
            return cached;
        }

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
                setCachedValidation(cacheKey, "cliente");
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
                setCachedValidation(cacheKey, "encargado");
                return "encargado";
            }

            logger.log("❌ Usuario no es ni cliente ni encargado");
            setCachedValidation(cacheKey, null);
            return null;

        } catch (error) {
            logger.error("❌ Error validando rol:", error);
            setCachedValidation(cacheKey, null);
            return null;
        }
    }, [URI_API, getCachedValidation, setCachedValidation]);

    /**
     * Validar si el usuario existe en nuestra base de datos usando /usuarios/validate
     */
    const validateUserInDB = useCallback(async (token: string) => {
        const cacheKey = `validate_user_${token.slice(-10)}`; // Últimos 10 chars como key

        // 🔍 Verificar caché primero
        const cached = getCachedValidation(cacheKey);
        if (cached !== null) {
            return cached;
        }

        try {
            logger.log("🔍 Validando usuario en BD con /usuarios/validate...");

            const response = await validateUser(token);

            logger.log("📥 Respuesta de validateUser:", {
                status: response.status,
                ok: response.ok,
                data: response.data
            });

            let result;

            if (response.ok) {
                const data = response.data;

                if (data === true || (typeof data === 'object' && data.exists === true)) {
                    logger.log("✅ Usuario existe en BD - AHORA VALIDAR ROLES");

                    // 🎯 VALIDAR ROLES con los endpoints correctos
                    const roleValidation = await validateUserRole(token);

                    if (roleValidation) {
                        logger.log(`✅ Rol validado correctamente: ${roleValidation}`);

                        // Obtener perfil completo
                        const profileResponse = await getUserProfile(token);
                        const profile = profileResponse.ok ? profileResponse.data : null;

                        result = { exists: true, role: roleValidation, profile };
                    } else {
                        logger.log("❌ Error validando rol del usuario");
                        result = { exists: false, role: null, profile: null };
                    }
                } else {
                    logger.log("❌ Usuario no existe en BD - NECESITA ONBOARDING");
                    result = { exists: false, role: null, profile: null };
                }
            } else {
                logger.log("❌ Error en API validate - NECESITA ONBOARDING");
                result = { exists: false, role: null, profile: null };
            }

            // 💾 Guardar en caché
            setCachedValidation(cacheKey, result);
            return result;

        } catch (error) {
            logger.error("❌ Error validando usuario:", error);
            const result = { exists: false, role: null, profile: null };
            setCachedValidation(cacheKey, result);
            return result;
        }
    }, [getCachedValidation, setCachedValidation, validateUserRole]);

    /**
     * Procesar usuario de Firebase después del login (CON PROTECCIÓN ANTI-DUPLICADOS MEJORADA)
     */
    const processFirebaseUser = useCallback(async (firebaseUser: User) => {
        const userEmail = firebaseUser.email || '';

        // 🛡️ PROTECCIÓN ANTI-DUPLICADOS CON useRef (PERSISTE ENTRE RENDERS)
        if (processingUsersRef.current.has(userEmail)) {
            logger.log("⏭️ Usuario ya está siendo procesado, saltando...");
            return;
        }

        // Marcar como en proceso
        processingUsersRef.current.add(userEmail);

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

            // 3. Validar en BD (CON CACHÉ)
            logger.log("🔍 Consultando usuario en base de datos...");
            const validation = await validateUserInDB(token);

            logger.log("🎯 Resultado de validación:", {
                exists: validation.exists,
                role: validation.role,
                hasProfile: !!validation.profile
            });

            if (validation.exists && validation.role && validation.profile) {
                // ✅ Usuario COMPLETO - existe en BD con perfil
                logger.log("✅ Usuario completamente autenticado");
                logger.log(`👤 Rol FINAL: ${validation.role}`);

                // Guardar en sessionStorage
                sessionStorage.setItem('auth_token', token);
                sessionStorage.setItem('auth_role', validation.role);
                sessionStorage.setItem('auth_profile', JSON.stringify(validation.profile));
                sessionStorage.setItem('auth_userEmail', firebaseUser.email || '');

                store.setState({
                    type: 'AUTHENTICATED',
                    firebaseUser,
                    token,
                    role: validation.role as 'cliente' | 'encargado',
                    profile: validation.profile
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
        } finally {
            // Limpiar flag de procesamiento después de un tiempo
            setTimeout(() => {
                processingUsersRef.current.delete(userEmail);
            }, 3000);
        }
    }, [store, validateUserInDB]);

    // ============================================================================
    // MÉTODOS PÚBLICOS
    // ============================================================================

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            logger.log("🔐 Iniciando login con email/password");

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await processFirebaseUser(userCredential.user);

            // 🆕 LLAMAR A countLogin SOLO SI EL LOGIN FUE EXITOSO
            const currentToken = store.getToken();
            if (currentToken && store.isAuthenticated()) {
                try {
                    logger.log("📊 Contando login exitoso...");
                    await countLogin(currentToken);
                    logger.log("✅ Login contabilizado correctamente");
                } catch (error) {
                    logger.error("❌ Error contabilizando login:", error);
                    // No fallar el login por esto, solo loggear
                }
            }

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
                token: '',
                isGoogleUser: true,
                userEmail: result.user.email || ''
            });

            await processFirebaseUser(result.user);

            // 🆕 LLAMAR A countLogin SOLO SI EL LOGIN FUE EXITOSO
            const currentToken = store.getToken();
            if (currentToken && store.isAuthenticated()) {
                try {
                    logger.log("📊 Contando login con Google exitoso...");
                    await countLogin(currentToken);
                    logger.log("✅ Login con Google contabilizado correctamente");
                } catch (error) {
                    logger.error("❌ Error contabilizando login con Google:", error);
                    // No fallar el login por esto, solo loggear
                }
            }

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

            // 1. Limpiar caché y flags
            validationCacheRef.current.clear();
            processingUsersRef.current.clear();

            // 2. Limpiamos todo
            await signOut(auth);
            authCookies.clearAuth();
            store.reset();

            toast.success("Cierre de sesión exitoso", { id: toastId });

            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (error) {
            logger.error("❌ Error en logout:", error);

            // Siempre limpiamos aunque haya error
            validationCacheRef.current.clear();
            processingUsersRef.current.clear();
            authCookies.clearAuth();
            store.reset();

            toast.error("Error al cerrar sesión. Redirigiendo...", { duration: 2000 });

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        }
    };

    const completeOnboarding = async () => {
        try {
            logger.log("🎉 Completando onboarding");

            // Limpiar caché para forzar nueva validación
            validationCacheRef.current.clear();
            processingUsersRef.current.clear();

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
    // EFFECTS (MEJORADOS CON useCallback)
    // ============================================================================

    // Cargar datos iniciales desde storage
    useEffect(() => {
        const loadInitialData = () => {
            try {
                logger.log("📦 Cargando datos iniciales...");

                const savedData = authCookies.getAuthData();

                if (savedData.token) {
                    if (savedData.role && savedData.profile) {
                        logger.log("✅ Datos completos encontrados en storage");
                    } else {
                        logger.log("🔄 Token encontrado - usuario en onboarding");
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
    }, []); // ← ARREGLADO: Sin dependencias para evitar loop

    // 🆕 MEJORADO: onAuthStateChanged con mejor lógica de duplicados
    useEffect(() => {
        if (!store.hasLoadedFromStorage) {
            return;
        }

        logger.log("🔄 Iniciando listener de Firebase Auth");

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            logger.log("🔍 onAuthStateChanged:", firebaseUser?.email || 'null');

            if (firebaseUser) {
                const savedData = authCookies.getAuthData();
                const userEmail = firebaseUser.email || '';

                // 🔍 VERIFICAR SI YA TENEMOS ESTADO VÁLIDO PARA ESTE USUARIO
                const hasValidState =
                    savedData.userEmail === userEmail &&
                    (store.isAuthenticated() || store.needsOnboarding() || store.emailNotVerified());

                // 🔍 VERIFICAR SI YA ESTÁ SIENDO PROCESADO
                const isBeingProcessed = processingUsersRef.current.has(userEmail);

                if (hasValidState && !isBeingProcessed) {
                    logger.log("✅ Usuario ya tiene estado válido, restaurando desde storage...");

                    // Restaurar estado desde storage sin hacer nuevas llamadas
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
                } else if (!isBeingProcessed) {
                    logger.log("🔄 Procesando usuario nuevo o estado inválido...");
                    await processFirebaseUser(firebaseUser);
                } else {
                    logger.log("⏳ Usuario ya está siendo procesado, esperando...");
                }
            } else {
                logger.log("❌ Usuario no autenticado en Firebase");
                validationCacheRef.current.clear(); // Limpiar caché
                processingUsersRef.current.clear(); // Limpiar flags
                authCookies.clearAuth();
                store.setState({ type: 'UNAUTHENTICATED' });
            }
        });

        return () => unsubscribe();
    }, [store.hasLoadedFromStorage]); // ← ARREGLADO: Solo dependencia específica

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