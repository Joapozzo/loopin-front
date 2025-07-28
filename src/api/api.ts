import { auth } from '@/auth/firebase';
import { logger } from '@/utils/logger';

const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export class ApiClient {
    private baseURL: string;

    constructor(baseURL: string = URI_API) {
        this.baseURL = baseURL;
    }

    // 🔥 MÉTODO MEJORADO para obtener el token
    private async getAuthToken(): Promise<string | null> {
        try {
            // Prioridad 1: Intentar obtener token del usuario actual de Firebase
            const user = auth.currentUser;
            if (user) {
                return await user.getIdToken();
            }

            // Prioridad 2: Si no hay usuario de Firebase, usar localStorage
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                return storedToken;
            }

            return null;
        } catch (error) {
            logger.error('❌ ApiClient: Error obteniendo token:', error);
            
            // Fallback: intentar localStorage si falla Firebase
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                return storedToken;
            }
            
            return null;
        }
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        
        // Obtener token automáticamente
        const token = await this.getAuthToken();

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                // Incluir token si existe
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                let errorData;
                
                try {
                    // Intentar parsear la respuesta de error como JSON
                    errorData = await response.json();
                } catch (parseError) {
                    // Si no se puede parsear, usar estructura básica
                    errorData = { detail: `HTTP error! status: ${response.status}` };
                }

                // Manejar errores de autenticación específicamente
                if (response.status === 401) {
                    const error = new Error('No autorizado. Por favor, inicia sesión nuevamente.');
                    (error as any).status = 401;
                    (error as any).data = errorData;
                    throw error;
                }
                
                if (response.status === 403) {
                    const error = new Error('No tienes permisos para realizar esta acción.');
                    (error as any).status = 403;
                    (error as any).data = errorData;
                    throw error;
                }

                // Para otros errores, usar el detail del servidor si existe
                const errorMessage = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
                const error = new Error(errorMessage);
                
                // Preservar información adicional del error
                (error as any).status = response.status;
                (error as any).data = errorData;
                (error as any).detail = errorData.detail;
                (error as any).response = response;
                
                throw error;
            }

            return await response.json();
        } catch (error) {
            // Si ya es un error que lanzamos arriba, no lo envolvemos
            if (error instanceof Error && (error as any).status) {
                throw error;
            }
            
            // Solo para errores de red u otros errores no relacionados con HTTP
            throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Método especial para FormData (sin Content-Type)
    private async requestFormData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        
        // Obtener token automáticamente
        const token = await this.getAuthToken();

        const config: RequestInit = {
            headers: {
                // NO incluir Content-Type para FormData, el browser lo maneja automáticamente
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                let errorData;
                
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    errorData = { detail: `HTTP error! status: ${response.status}` };
                }

                if (response.status === 401) {
                    const error = new Error('No autorizado. Por favor, inicia sesión nuevamente.');
                    (error as any).status = 401;
                    (error as any).data = errorData;
                    throw error;
                }
                
                if (response.status === 403) {
                    const error = new Error('No tienes permisos para realizar esta acción.');
                    (error as any).status = 403;
                    (error as any).data = errorData;
                    throw error;
                }

                const errorMessage = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
                const error = new Error(errorMessage);
                
                (error as any).status = response.status;
                (error as any).data = errorData;
                (error as any).detail = errorData.detail;
                (error as any).response = response;
                
                throw error;
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error && (error as any).status) {
                throw error;
            }
            
            throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // NUEVO: POST para FormData
    async postFormData<T>(endpoint: string, data: FormData): Promise<T> {
        return this.requestFormData<T>(endpoint, {
            method: 'POST',
            body: data,
        });
    }

    async put<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // NUEVO: PUT para FormData  
    async putFormData<T>(endpoint: string, data: FormData): Promise<T> {
        return this.requestFormData<T>(endpoint, {
            method: 'PUT',
            body: data,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}