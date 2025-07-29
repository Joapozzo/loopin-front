const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAllUsers = async () => {
    const response = await fetch(`${URI_API}/usuarios`);
    const data = await response.json();
    return data.usuarios;
};

export const getUserById = async (id: number) => {
    const response = await fetch(`${URI_API}/usuarios/${id}`);
    const data = await response.json();
    return data;
};

export const createUser = async (data: any, token: string) => {
    try {
        const res = await fetch(`${URI_API}/usuarios/cliente`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        // Devolver tanto el status como los datos
        return {
            status: res.status,
            ok: res.ok,
            data: result
        };

    } catch (error: any) {
        console.error("Error al crear usuario:", error);
        return {
            status: 500,
            ok: false,
            data: { error: error.message }
        };
    }
};

export const validateToken = async (token: string) => {
    try {
        const res = await fetch(`${URI_API}/validate_token`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await res.json();

        return {
            status: res.status,
            ok: res.ok,
            data: result
        };

    } catch (error: any) {
        console.error("Error al validar token:", error);
        return {
            status: 500,
            ok: false,
            data: { error: error.message }
        };
    }
};

export const getUserProfile = async (token: string) => {
    try {
        const res = await fetch(`${URI_API}/usuarios/ver_perfil`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await res.json();

        return {
            status: res.status,
            ok: res.ok,
            data: result
        };

    } catch (error: any) {
        console.error("Error al obtener perfil:", error);
        return {
            status: 500,
            ok: false,
            data: { error: error.message }
        };
    }
};

export const validateUser = async (token: string) => {
    try {
        const res = await fetch(`${URI_API}/usuarios/validate`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await res.json();

        return {
            status: res.status,
            ok: res.ok,
            data: result
        };

    } catch (error: any) {
        console.error("Error al validar perfil:", error);
        return {
            status: 500,
            ok: false,
            data: { error: error.message }
        };
    }
};
