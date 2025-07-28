"use client";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { auth } from "@/auth/firebase";
import { onAuthStateChanged, signOut, User, signInWithEmailAndPassword } from "firebase/auth";
import { getUserProfile } from "@/api/usuariosFetch"
import toast from "react-hot-toast";
import { logger } from "@/utils/logger";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<"cliente" | "encargado" | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExplicitLogin, setIsExplicitLogin] = useState(false);
    const [isGoogleLogin, setIsGoogleLogin] = useState(false);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [emailNotVerified, setEmailNotVerified] = useState(false);
    const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false); // 🆕 Flag para saber si ya cargamos desde localStorage

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

            // 🔥 NUEVA LÓGICA: Si ambas APIs devuelven 200 pero con false, necesita onboarding
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
            // 🔥 PASO 0: VERIFICAR EMAIL ANTES QUE NADA
            if (!firebaseUser.emailVerified) {
                logger.log("❌ Email no verificado para usuario:", firebaseUser.email);
                setEmailNotVerified(true);
                setNeedsOnboarding(false);
                setToken(null);
                setUser(firebaseUser);
                setUserRole(null);
                setUserProfile(null);
                return false;
            }

            // Email verificado, limpiar el flag
            setEmailNotVerified(false);

            // Paso 1: Obtener token de Firebase
            const firebaseToken = await firebaseUser.getIdToken();

            // Paso 2: Validar rol del usuario
            const roleOrStatus = await validateUserRole(firebaseToken);

            // 🆕 Si necesita onboarding, configurar estado especial
            if (roleOrStatus === "needs_onboarding") {
                logger.log("🆕 Usuario nuevo detectado - configurando para onboarding");
                setToken(firebaseToken);
                setUser(firebaseUser);
                setUserRole(null); // 🔥 NO asignar rol hasta completar onboarding
                setNeedsOnboarding(true);
                setUserProfile(null);
                setEmailNotVerified(false);
                return true; // ✅ Retornar true para usuarios que necesitan onboarding
            }

            // Si no tiene rol válido, fallar
            if (!roleOrStatus || roleOrStatus === null) {
                logger.log("❌ Usuario sin rol válido");
                return false;
            }

            // Resto del código existente...
            const profileResponse = await getUserProfile(firebaseToken);
            if (!profileResponse.ok) {
                logger.error("❌ Error obteniendo perfil:", profileResponse.data);
                return false;
            }

            localStorage.setItem("token", firebaseToken);
            localStorage.setItem("role", roleOrStatus);
            localStorage.setItem("userProfile", JSON.stringify(profileResponse.data));

            setToken(firebaseToken);
            setUser(firebaseUser);
            setUserRole(roleOrStatus);
            setUserProfile(profileResponse.data);
            setNeedsOnboarding(false);

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

            // 🔥 VERIFICACIÓN DE EMAIL PARA GOOGLE TAMBIÉN
            if (!googleUser.emailVerified) {
                logger.log("❌ Email de Google no verificado (raro, pero posible)");
                setEmailNotVerified(true);
                setNeedsOnboarding(false);
                setToken(null);
                setUser(googleUser);
                setUserRole(null);
                setUserProfile(null);
                setIsLoading(false);
                setIsGoogleLogin(false);
                return false;
            }

            // Email verificado, proceder normalmente
            setEmailNotVerified(false);

            // 🆕 NO cerrar sesión - mantener el usuario de Google activo
            // Obtener token de Firebase del usuario de Google
            const firebaseToken = await googleUser.getIdToken();

            // Validar rol del usuario en nuestro sistema
            const roleOrStatus = await validateUserRole(firebaseToken);

            // Si necesita onboarding, configurar estado especial
            if (roleOrStatus === "needs_onboarding" || roleOrStatus === null) {
                logger.log("🔄 Usuario de Google con email verificado necesita onboarding");

                // 🔥 GUARDAR EN LOCALSTORAGE CON FLAG PERSISTENTE
                localStorage.setItem("token", firebaseToken);
                localStorage.setItem("googleUser", "true");
                localStorage.setItem("googleUserEmail", googleUser.email || ""); // 🆕 Email de referencia

                setToken(firebaseToken);
                setUser(googleUser);
                setNeedsOnboarding(true);
                setUserRole(null);
                setUserProfile(null);
                setIsLoading(false);
                setIsGoogleLogin(false);

                logger.log("✅ Google login configurado para onboarding");
                return true;
            }

            // Usuario existente con rol válido
            const profileResponse = await getUserProfile(firebaseToken);
            if (!profileResponse.ok) {
                logger.error("❌ Error obteniendo perfil para usuario de Google:", profileResponse.data);
                setIsGoogleLogin(false);
                setIsLoading(false);
                return false;
            }

            // 🔥 GUARDAR TODO EN LOCALSTORAGE CON FLAG PERSISTENTE
            localStorage.setItem("token", firebaseToken);
            localStorage.setItem("role", roleOrStatus);
            localStorage.setItem("userProfile", JSON.stringify(profileResponse.data));
            localStorage.setItem("googleUser", "true");
            localStorage.setItem("googleUserEmail", googleUser.email || ""); // 🆕 Email de referencia

            setToken(firebaseToken);
            setUser(googleUser);
            setUserRole(roleOrStatus);
            setUserProfile(profileResponse.data);
            setNeedsOnboarding(false);
            setIsLoading(false);
            setIsGoogleLogin(false);

            logger.log(`✅ Usuario de Google autenticado como: ${roleOrStatus}`);
            return true;

        } catch (error) {
            logger.error("❌ Error en login con Google:", error);
            setIsGoogleLogin(false);
            setIsLoading(false);
            throw error;
        }
    };

    useEffect(() => {
        const loadFromStorage = () => {
            const storedToken = localStorage.getItem("token");
            const storedRole = localStorage.getItem("role") as "cliente" | "encargado" | null;
            const storedProfile = localStorage.getItem("userProfile");
            // const isGoogleUser = localStorage.getItem("googleUser") === "true";

            if (storedToken) {
                try {
                    setToken(storedToken);

                    if (storedRole && storedProfile) {
                        setUserRole(storedRole);
                        setUserProfile(JSON.parse(storedProfile));
                        setNeedsOnboarding(false);
                        setEmailNotVerified(false);

                        window.dispatchEvent(new StorageEvent('storage', {
                            key: 'userProfile',
                            newValue: storedProfile,
                            url: window.location.href
                        }));

                        const comercioData = localStorage.getItem('comercio_encargado_data');
                        if (comercioData) {
                            window.dispatchEvent(new StorageEvent('storage', {
                                key: 'comercio_encargado_data',
                                newValue: comercioData,
                                url: window.location.href
                            }));
                        }
                    } else {
                        setNeedsOnboarding(true);
                        setUserRole(null);
                        setUserProfile(null);
                    }

                    setHasLoadedFromStorage(true);
                } catch (error) {
                    logger.error("❌ Error cargando datos desde localStorage:", error);
                    localStorage.clear();
                    setHasLoadedFromStorage(true);
                }
            } else {
                logger.log("📦 No hay datos en localStorage");
                setHasLoadedFromStorage(true);
            }
        };

        loadFromStorage();
    }, []);

    // 🔥 onAuthStateChanged CONTROLADO Y INTELIGENTE
    useEffect(() => {
        // No iniciar hasta que hayamos cargado desde localStorage
        if (!hasLoadedFromStorage) {
            logger.log("⏳ Esperando carga desde localStorage...");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            logger.log("🔍 onAuthStateChanged triggered");
            logger.log("🎯 isGoogleLogin:", isGoogleLogin);
            logger.log("🎯 user:", firebaseUser?.email);
            logger.log("🎯 emailVerified:", firebaseUser?.emailVerified);

            // 🔥 Si es un login de Google activo, COMPLETAMENTE SALTEADO
            if (isGoogleLogin) {
                logger.log("⏭️ SALTEANDO onAuthStateChanged - es Google login activo");
                return;
            }

            if (firebaseUser) {
                logger.log("🔍 Usuario detectado en Firebase:", firebaseUser.email);

                // 🆕 Verificar si este usuario coincide con el Google user guardado
                const isGoogleUser = localStorage.getItem("googleUser") === "true";
                const googleUserEmail = localStorage.getItem("googleUserEmail");
                const hasCompleteSession = token && userRole && userProfile && !needsOnboarding && !emailNotVerified;

                // 🆕 Si es Google user y ya tenemos sesión completa, verificar email match
                if (hasCompleteSession && isGoogleUser && googleUserEmail === firebaseUser.email) {
                    logger.log("✅ Usuario de Google con sesión completa y email coincidente, omitiendo revalidación");
                    setUser(firebaseUser); // Solo actualizar el objeto user de Firebase
                    setIsLoading(false);
                    return;
                }

                // 🆕 Si tenemos token pero estamos en onboarding y es mismo Google user
                if (token && needsOnboarding && isGoogleUser && googleUserEmail === firebaseUser.email) {
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
                const isGoogleUser = localStorage.getItem("googleUser") === "true";

                if (!isGoogleUser) {
                    logger.log("🚪 Usuario desautenticado");
                    localStorage.clear();
                    setToken(null);
                    setUser(null);
                    setUserRole(null);
                    setUserProfile(null);
                    setNeedsOnboarding(false);
                    setEmailNotVerified(false);
                } else {
                    logger.log("🔒 Usuario de Google sin Firebase user, manteniendo datos de localStorage");
                    // Mantener datos pero marcar como no loading
                }
            }

            setIsLoading(false);
            setIsExplicitLogin(false);
        });

        return () => unsubscribe();
    }, [hasLoadedFromStorage, isGoogleLogin, token, userRole, userProfile, needsOnboarding, emailNotVerified]); // 🆕 Dependencias mejoradas

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
            localStorage.clear();

            toast.success("Sesión cerrada correctamente", { id: toastId });

            window.location.href = "/login";
        } catch (error) {
            logger.error("❌ Error en logout:", error);

            localStorage.clear();
            setToken(null);
            setUser(null);
            setUserRole(null);
            setUserProfile(null);
            setNeedsOnboarding(false);
            setEmailNotVerified(false);

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

                localStorage.setItem("token", newToken);
                localStorage.setItem("role", roleOrStatus);
                setToken(newToken);
                setUserRole(roleOrStatus);

                return newToken;
            } catch (error) {
                logger.error("❌ Error refrescando token:", error);
                return null;
            }
        }
        return null;
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!token && !!user && !!userRole && !needsOnboarding && !emailNotVerified,
                token,
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