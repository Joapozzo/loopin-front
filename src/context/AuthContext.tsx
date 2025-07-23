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
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<"cliente" | "encargado" | null>(
        null
    );
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;

    const validateUserRole = async (
        firebaseToken: string
    ): Promise<"cliente" | "encargado" | null> => {
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

            // Si ninguno funciona, verificar si es error de permisos
            if (clienteResponse.status === 403 || encargadoResponse.status === 403) {
                const errorData = await (clienteResponse.status === 403
                    ? clienteResponse
                    : encargadoResponse
                ).json();
                console.error("❌ Acceso denegado:", errorData.detail);
                return null;
            }

            return null;
        } catch (error) {
            console.error("❌ Error validando rol del usuario:", error);
            return null;
        }
    };

    const validateUserSession = async (firebaseUser: User): Promise<boolean> => {
        try {
            // Paso 1: Obtener token de Firebase
            const firebaseToken = await firebaseUser.getIdToken();

            // Paso 2: Validar rol del usuario
            const role = await validateUserRole(firebaseToken);

            if (!role) {
                return false;
            }

            // Paso 3: Obtener perfil del usuario
            const profileResponse = await getUserProfile(firebaseToken);

            if (!profileResponse.ok) {
                console.error("❌ Error obteniendo perfil:", profileResponse.data);
                return false;
            }

            // Paso 4: Guardar todo en estado y localStorage
            localStorage.setItem("token", firebaseToken);
            localStorage.setItem("role", role);
            localStorage.setItem("userProfile", JSON.stringify(profileResponse.data));

            setToken(firebaseToken);
            setUser(firebaseUser);
            setUserRole(role);
            setUserProfile(profileResponse.data);

            return true;
        } catch (error) {
            console.error("❌ Error en validación de sesión:", error);
            return false;
        }
    };

    // Escuchar cambios en el estado de autenticación de Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Usuario autenticado en Firebase, hacer validación completa
                const isValid = await validateUserSession(firebaseUser);

                if (!isValid) {
                    // Si la validación falla, desconectar de Firebase
                    await signOut(auth);
                }
            } else {
                // Usuario no autenticado, limpiar todo
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("userProfile");

                setToken(null);
                setUser(null);
                setUserRole(null);
                setUserProfile(null);
            }

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Cargar datos desde localStorage al iniciar (si existen)
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role") as
            | "cliente"
            | "encargado"
            | null;
        const storedProfile = localStorage.getItem("userProfile");

        if (storedToken && storedRole && storedProfile) {
            try {
                setToken(storedToken);
                setUserRole(storedRole);
                setUserProfile(JSON.parse(storedProfile));
            } catch (error) {
                console.error("❌ Error cargando datos desde localStorage:", error);
                // Limpiar localStorage corrupto
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("userProfile");
            }
        }
    }, []);

    // Función de login que maneja todo el flujo
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // El signInWithEmailAndPassword disparará onAuthStateChanged
            // que a su vez ejecutará validateUserSession
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.error("❌ Error en login:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("comercio_encargado_data");
            // El cleanup se hará automáticamente en onAuthStateChanged
        } catch (error) {
            console.error("❌ Error en logout:", error);
            // Limpiar manualmente si Firebase falla
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userProfile");
            localStorage.removeItem("comercio_encargado_data");
            localStorage.removeItem("restaurante-seleccionado-storage");
            setToken(null);
            setUser(null);
            setUserRole(null);
            setUserProfile(null);
        }
    };

    const refreshToken = async (): Promise<string | null> => {
        if (user) {
            try {
                const newToken = await user.getIdToken(true); // force refresh

                // Revalidar rol con la API
                const role = await validateUserRole(newToken);
                if (!role) {
                    await logout();
                    return null;
                }

                localStorage.setItem("token", newToken);
                localStorage.setItem("role", role);
                setToken(newToken);
                setUserRole(role);
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
                isAuthenticated: !!token && !!user && !!userProfile,
                token,
                user,
                userRole,
                userProfile,
                isLoading,
                login,
                logout,
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthContext must be used within AuthProvider");
    return context;
};