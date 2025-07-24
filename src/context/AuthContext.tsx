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
    emailNotVerified: boolean; // 🆕 Flag para email no verificado
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
    const [emailNotVerified, setEmailNotVerified] = useState(false); // 🆕 Estado para email no verificado

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

            // Si ambas validaciones fallan con 403, necesita onboarding
            if (clienteResponse.status === 403 || encargadoResponse.status === 403) {
                return "needs_onboarding";
            }

            // Si llega aquí, no tiene acceso válido
            return null;
        } catch (error) {
            console.error("❌ Error validando rol del usuario:", error);
            return null;
        }
    };

    const validateUserSession = async (firebaseUser: User): Promise<boolean> => {
        try {
            // 🔥 PASO 0: VERIFICAR EMAIL ANTES QUE NADA
            if (!firebaseUser.emailVerified) {
                console.log("❌ Email no verificado para usuario:", firebaseUser.email);
                setEmailNotVerified(true);
                setNeedsOnboarding(false);
                setToken(null);
                setUser(firebaseUser); // Guardar usuario para poder reenviar email
                setUserRole(null);
                setUserProfile(null);
                return false; // No continuar con la validación
            }

            // Email verificado, limpiar el flag
            setEmailNotVerified(false);

            // Paso 1: Obtener token de Firebase
            const firebaseToken = await firebaseUser.getIdToken();
            
            // Paso 2: Validar rol del usuario
            const roleOrStatus = await validateUserRole(firebaseToken);

            // Si necesita onboarding, configurar estado especial
            if (roleOrStatus === "needs_onboarding") {
                console.log("🔄 Email verificado, pero necesita onboarding");
                setToken(firebaseToken);
                setUser(firebaseUser);
                setNeedsOnboarding(true);
                setUserRole(null);
                setUserProfile(null);
                return true; // Sesión válida pero necesita onboarding
            }

            // Si no tiene rol válido, fallar
            if (!roleOrStatus || roleOrStatus === null) {
                console.log("❌ Usuario sin rol válido");
                return false;
            }

            // Paso 3: Obtener perfil del usuario (solo si tiene rol válido)
            const profileResponse = await getUserProfile(firebaseToken);
            if (!profileResponse.ok) {
                console.error("❌ Error obteniendo perfil:", profileResponse.data);
                return false;
            }

            // Paso 4: Guardar todo en estado y localStorage
            localStorage.setItem("token", firebaseToken);
            localStorage.setItem("role", roleOrStatus);
            localStorage.setItem("userProfile", JSON.stringify(profileResponse.data));

            setToken(firebaseToken);
            setUser(firebaseUser);
            setUserRole(roleOrStatus);
            setUserProfile(profileResponse.data);
            setNeedsOnboarding(false);

            console.log(`✅ Usuario completamente autenticado como: ${roleOrStatus}`);
            return true;
        } catch (error) {
            console.error("❌ Error en validación de sesión:", error);
            return false;
        }
    };

    const completeOnboarding = async () => {
        console.log("🎉 Completando onboarding...");

        if (user) {
            // Revalidar sesión después de completar onboarding
            const isValid = await validateUserSession(user);
            if (!isValid) {
                console.log("❌ Error revalidando después de onboarding");
                await signOut(auth);
            }
        }

        setNeedsOnboarding(false);
    };

    // 🔥 FUNCIÓN DE LOGIN CON GOOGLE - COMPLETAMENTE INDEPENDIENTE
    const loginWithGoogle = async (googleUser: User): Promise<boolean> => {
        try {
            console.log("🔐 Iniciando login con Google para:", googleUser.email);
            setIsGoogleLogin(true); // 🔥 Bloquear onAuthStateChanged

            // 🔥 VERIFICACIÓN DE EMAIL PARA GOOGLE TAMBIÉN
            if (!googleUser.emailVerified) {
                console.log("❌ Email de Google no verificado (raro, pero posible)");
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

            // Obtener token de Firebase del usuario de Google
            const firebaseToken = await googleUser.getIdToken();

            // Validar rol del usuario en nuestro sistema
            const roleOrStatus = await validateUserRole(firebaseToken);

            // Si necesita onboarding, configurar estado especial
            if (roleOrStatus === "needs_onboarding" || roleOrStatus === null) {
                console.log("🔄 Usuario de Google con email verificado necesita onboarding");
                
                // 🔥 GUARDAR EN LOCALSTORAGE INMEDIATAMENTE
                localStorage.setItem("token", firebaseToken);
                localStorage.setItem("googleLogin", "true"); // Flag especial
                
                setToken(firebaseToken);
                setUser(googleUser);
                setNeedsOnboarding(true);
                setUserRole(null);
                setUserProfile(null);
                setIsLoading(false); // 🔥 IMPORTANTE: Terminar loading aquí
                setIsGoogleLogin(false);
                
                console.log("✅ Google login configurado para onboarding");
                return true;
            }

            // Usuario existente con rol válido
            const profileResponse = await getUserProfile(firebaseToken);
            if (!profileResponse.ok) {
                console.error("❌ Error obteniendo perfil para usuario de Google:", profileResponse.data);
                setIsGoogleLogin(false);
                setIsLoading(false);
                return false;
            }

            // 🔥 GUARDAR TODO EN LOCALSTORAGE INMEDIATAMENTE
            localStorage.setItem("token", firebaseToken);
            localStorage.setItem("role", roleOrStatus);
            localStorage.setItem("userProfile", JSON.stringify(profileResponse.data));
            localStorage.setItem("googleLogin", "true"); // Flag especial

            setToken(firebaseToken);
            setUser(googleUser);
            setUserRole(roleOrStatus);
            setUserProfile(profileResponse.data);
            setNeedsOnboarding(false);
            setIsLoading(false); // 🔥 IMPORTANTE: Terminar loading aquí
            setIsGoogleLogin(false);

            console.log(`✅ Usuario de Google autenticado como: ${roleOrStatus}`);
            return true;

        } catch (error) {
            console.error("❌ Error en login con Google:", error);
            setIsGoogleLogin(false);
            setIsLoading(false);
            throw error;
        }
    };

    // 🔥 onAuthStateChanged MUY CONTROLADO
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("🔍 onAuthStateChanged triggered");
            console.log("🎯 isGoogleLogin:", isGoogleLogin);
            console.log("🎯 user:", firebaseUser?.email);
            console.log("🎯 emailVerified:", firebaseUser?.emailVerified);

            // 🔥 Si es un login de Google, COMPLETAMENTE SALTEADO
            if (isGoogleLogin) {
                console.log("⏭️ SALTEANDO onAuthStateChanged - es Google login");
                return; // NO hacer setIsLoading(false) aquí
            }

            // 🔥 Si hay un flag de googleLogin en localStorage, también saltear
            const isGoogleLoginFlag = localStorage.getItem("googleLogin");
            if (isGoogleLoginFlag === "true") {
                console.log("⏭️ SALTEANDO onAuthStateChanged - flag de Google detectado");
                localStorage.removeItem("googleLogin");
                setIsLoading(false);
                return;
            }

            if (firebaseUser) {
                console.log("🔍 Usuario detectado en Firebase (onAuthStateChanged):", firebaseUser.email);

                console.log("✅ Procediendo con validación de sesión completa");
                const isValid = await validateUserSession(firebaseUser);
                if (!isValid) {
                    console.log("❌ Validación fallida, cerrando sesión");
                    await signOut(auth);
                }
            } else {
                // Usuario no autenticado, limpiar todo
                console.log("🚪 Usuario desautenticado");
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("userProfile");
                localStorage.removeItem("googleLogin"); // Limpiar flag también
                setToken(null);
                setUser(null);
                setUserRole(null);
                setUserProfile(null);
                setNeedsOnboarding(false);
                setEmailNotVerified(false); // 🆕 Limpiar flag de email
            }
            
            setIsLoading(false);
            setIsExplicitLogin(false);
        });

        return () => unsubscribe();
    }, [isGoogleLogin]); // 🔥 Solo dependencia de isGoogleLogin

    // Cargar datos desde localStorage al iniciar (si existen)
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role") as "cliente" | "encargado" | null;
        const storedProfile = localStorage.getItem("userProfile");

        if (storedToken && storedRole && storedProfile) {
            try {
                console.log("📦 Cargando datos desde localStorage");
                setToken(storedToken);
                setUserRole(storedRole);
                setUserProfile(JSON.parse(storedProfile));
                setNeedsOnboarding(false);
                setEmailNotVerified(false); // 🆕 Usuario ya está completo
            } catch (error) {
                console.error("❌ Error cargando datos desde localStorage:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("userProfile");
            }
        }
    }, []);

    // Función de login que maneja todo el flujo
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            console.log("🔐 Iniciando login explícito para:", email);
            setIsExplicitLogin(true);

            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.error("❌ Error en login:", error);
            setIsExplicitLogin(false);
            throw error;
        }
    };

    const logout = async () => {
        try {
            window.location.href = "/login";
            await signOut(auth);
            localStorage.clear();
        } catch (error) {
            console.error("❌ Error en logout:", error);

            localStorage.clear();
            setToken(null);
            setUser(null);
            setUserRole(null);
            setUserProfile(null);
            setNeedsOnboarding(false);
            setEmailNotVerified(false); // 🆕 Reset email flag
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
                console.error("❌ Error refrescando token:", error);
                return null;
            }
        }
        return null;
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!token && !!user && !needsOnboarding && !emailNotVerified, // 🆕 Incluir emailNotVerified
                token,
                user,
                userRole,
                userProfile,
                isLoading,
                needsOnboarding,
                emailNotVerified, // 🆕 Exponer flag
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