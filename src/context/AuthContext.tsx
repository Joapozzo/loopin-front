"use client";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    userRole: string | null;
    isLoading: boolean;
    login: (token: string, role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");

        if (storedToken) setToken(storedToken);
        if (storedRole) setUserRole(storedRole);

        setIsLoading(false);
    }, []);

    const login = (token: string, role: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setToken(token);
        setUserRole(role);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!token,
                token,
                login,
                logout,
                userRole,
                isLoading,
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
