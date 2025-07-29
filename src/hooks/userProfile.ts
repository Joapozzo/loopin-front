"use client";
import { ClienteCompleto } from "@/types/clienteCompleto";
import { useAuth } from "@/hooks/useAuth"; // 🆕 Usar el AuthContext

export const useUserProfile = () => {
    // 🆕 Obtener datos directamente del AuthContext
    const { 
        userProfile, 
        isLoading: authLoading, 
        isAuthenticated 
    } = useAuth();

    // 🔍 Extraer datos del usuario desde el AuthContext
    const userData = userProfile?.usuario || null;
    
    // 📋 Estados derivados
    const isLoading = authLoading;
    const error = !isAuthenticated && !authLoading ? "Usuario no autenticado" : null;

    // 🔧 Función para obtener el nombre completo
    const getNombreCompleto = () => {
        // Buscar en cliente o en usuario según la estructura
        const nombre = userProfile?.cliente?.cli_nom || userData?.cli_nom;
        const apellido = userProfile?.cliente?.cli_ape || userData?.cli_ape;
        
        if (nombre && apellido) {
            return `${nombre} ${apellido}`;
        }
        return userData?.usu_username || "";
    };

    // 🔧 Función para formatear fecha
    const formatearFecha = (fecha: string | null) => {
        if (!fecha) return "";
        return new Date(fecha).toLocaleDateString('es-AR');
    };

    // 🔧 Obtener datos del cliente desde el profile
    const getClienteData = () => {
        return userProfile?.cliente || null;
    };

    return {
        // ✅ Datos individuales del usuario (compatibilidad con la estructura anterior)
        nombre: userProfile?.cliente?.cli_nom || "",
        apellido: userProfile?.cliente?.cli_ape || "",
        email: userData?.usu_mail || "",
        celular: userData?.usu_cel || "",
        dni: userData?.usu_dni || "",
        username: userData?.usu_username || "",
        fechaNacimiento: userProfile?.cliente?.cli_fec_nac || "",

        // ✅ Datos de localización
        localidadId: userData?.usu_loc_id || 0,

        // ✅ Datos del cliente
        clienteId: userProfile?.cliente?.cli_id || 0,

        // ✅ Funciones helper
        nombreCompleto: getNombreCompleto(),
        fechaNacimientoFormateada: formatearFecha(userProfile?.cliente?.cli_fec_nac || null),

        // ✅ Estados del hook
        isLoading,
        error,

        // ✅ Objetos completos si los necesitas
        userData, // Solo los datos del usuario
        clienteData: getClienteData(), // Solo los datos del cliente
        fullProfile: userProfile, // El perfil completo como viene de la API

        // ✅ Estado de autenticación
        isAuthenticated,
    };
};