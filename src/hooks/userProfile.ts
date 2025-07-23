"use client";

import { ClienteCompleto } from "@/types/clienteCompleto";
import { useEffect, useState } from "react";

export const useUserProfile = () => {
    const [userData, setUserData] = useState<ClienteCompleto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUserProfile = () => {
            try {
                const userProfileData = localStorage.getItem("userProfile");

                if (!userProfileData) {
                    setError("No se encontraron datos del usuario");
                    setIsLoading(false);
                    return;
                }

                const parsedProfile = JSON.parse(userProfileData);

                // Si viene de la estructura del API (con .usuario)
                const clienteData = parsedProfile.usuario || parsedProfile;

                if (!clienteData) {
                    setError("Estructura de datos inválida");
                    setIsLoading(false);
                    return;
                }

                setUserData(clienteData as ClienteCompleto);
                setError(null);
            } catch (err) {
                console.error("Error cargando perfil de usuario:", err);
                setError("Error al cargar los datos del usuario");
            } finally {
                setIsLoading(false);
            }
        };

        loadUserProfile();

        // Opcional: Escuchar cambios en localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "userProfile") {
                loadUserProfile();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Función para obtener el nombre completo
    const getNombreCompleto = () => {
        if (userData?.cli_nom && userData?.cli_ape) {
            return `${userData.cli_nom} ${userData.cli_ape}`;
        }
        return userData?.usu_username || "";
    };

    // Función para obtener el rol en texto
    // const getRolTexto = () => {
    //     switch (userData?.tip_id) {
    //         case 1:
    //             return "Usuario";
    //         case 2:
    //             return "Encargado";
    //         default:
    //             return "Desconocido";
    //     }
    // };

    // Función para formatear fecha
    const formatearFecha = (fecha: string | null) => {
        if (!fecha) return "";
        return new Date(fecha).toLocaleDateString('es-AR');
    };

    return {
        // Datos individuales del usuario
        // id: userData?.usu_id || "",
        nombre: userData?.cli_nom || "",
        apellido: userData?.cli_ape || "",
        email: userData?.usu_mail || "",
        celular: userData?.usu_cel || "",
        dni: userData?.usu_dni || "",
        username: userData?.usu_username || "",
        fechaNacimiento: userData?.cli_fec_nac || "",
        // fechaAlta: userData?.usu_fecha_alta || "",
        // fechaBaja: userData?.usu_fecha_baja || "",
        // fechaUltimoLogin: userData?.usu_fecha_ultimo_login || "",
        // loginCount: userData?.usu_login_count || 0,
        // activo: Boolean(userData?.usu_activo),

        // Datos de localización
        // localidadId: userData?.usu_loc_id || 0,
        // localidad: userData?.loc_nom || "",
        // provinciaId: userData?.pro_id || 0,

        // Datos del cliente
        clienteId: userData?.cli_id || 0,
        // tipoId: userData?.tip_id || 0,

        // Funciones helper
        nombreCompleto: getNombreCompleto(),
        // rolTexto: getRolTexto(),
        fechaNacimientoFormateada: formatearFecha(userData?.cli_fec_nac || null),
        // fechaAltaFormateada: formatearFecha(userData?.usu_fecha_alta || null),

        // Estados del hook
        isLoading,
        error,

        // Objeto completo si lo necesitas
        userData,
    };
};