"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Hook personalizado para navegar a la página anterior o a una ruta por defecto.
 * 
 * @param defaultPath - Ruta por defecto a la que navegar si no hay historial anterior
 * @param skipPaths - Array de rutas que se deben omitir al volver atrás
 * @returns Objeto con funciones y estados para manejar la navegación hacia atrás
 */
export function useNavigateBack(defaultPath: string = "/home", skipPaths: string[] = []) {
  const router = useRouter();
  const currentPath = usePathname();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [hasPreviousPath, setHasPreviousPath] = useState<boolean>(false);

  // Almacena el historial de navegación en sessionStorage
  useEffect(() => {
    // Evitar ejecutarse en el servidor
    if (typeof window === "undefined") return;

    // Obtener el historial actual del sessionStorage
    const navigationHistory = JSON.parse(sessionStorage.getItem("navigationHistory") || "[]") as string[];
    
    // Solo almacena la ruta si es diferente a la última guardada
    if (navigationHistory.length === 0 || navigationHistory[navigationHistory.length - 1] !== currentPath) {
      // Añadir la ruta actual al historial
      navigationHistory.push(currentPath);
      
      // Limitar el historial a las últimas 10 rutas para evitar crecimiento excesivo
      const limitedHistory = navigationHistory.slice(-10);
      
      // Guardar el historial actualizado
      sessionStorage.setItem("navigationHistory", JSON.stringify(limitedHistory));
      
      // Encontrar la ruta anterior válida (que no esté en skipPaths)
      let validPreviousPath = null;
      for (let i = limitedHistory.length - 2; i >= 0; i--) {
        if (!skipPaths.includes(limitedHistory[i])) {
          validPreviousPath = limitedHistory[i];
          break;
        }
      }
      
      // Actualizar el estado del hook
      setPreviousPath(validPreviousPath);
      setHasPreviousPath(!!validPreviousPath);
    }
  }, [currentPath, skipPaths]);

  /**
   * Navega a la página anterior o a la ruta por defecto si no hay historial.
   */
  const goBack = () => {
    if (previousPath) {
      router.push(previousPath);
    } else {
      router.push(defaultPath);
    }
  };

  /**
   * Navega a la página anterior usando la API del navegador, con fallback a la ruta por defecto.
   */
  const goBackBrowser = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(defaultPath);
    }
  };

  /**
   * Elimina la ruta actual del historial y navega a la anterior.
   * Útil para páginas intermedias o de error que no deben estar en el historial.
   */
  const goBackAndForget = () => {
    // Obtener el historial actual
    const navigationHistory = JSON.parse(sessionStorage.getItem("navigationHistory") || "[]") as string[];
    
    // Eliminar la ruta actual
    const updatedHistory = navigationHistory.filter(path => path !== currentPath);
    
    // Guardar el historial actualizado
    sessionStorage.setItem("navigationHistory", JSON.stringify(updatedHistory));
    
    // Navegar hacia atrás
    goBack();
  };

  return {
    goBack,
    goBackBrowser,
    goBackAndForget,
    previousPath,
    hasPreviousPath
  };
}