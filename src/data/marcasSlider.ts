export interface Marca {
    id: number;
    nombre: string;
    logo: string;
    color: string;
}

export const marcasReales: Marca[] = [
    {
        id: 3,
        nombre: "Luco",
        logo: "/logos/logo-luco.svg",
        color: "#5f27cd"
    },
    {
        id: 1,
        nombre: "Bakeria",
        logo: "/logos/logo-bakeria.svg",
        color: "#44407a"
    },
    {
        id: 2,
        nombre: "Chez",
        logo: "/logos/logo-chez.svg",
        color: "#ff6b35"
    },
];

// 🚀 FUTURO: Cuando tengamos logos subidos, usar esta función
/*
export const getMarcasFromAPI = (sucursales: Sucursal[]): Marca[] => {
    return sucursales
        .filter(sucursal => sucursal.suc_activo === 1 && sucursal.suc_url_foto)
        .map(sucursal => ({
            id: sucursal.suc_id,
            nombre: sucursal.suc_nom,
            logo: sucursal.suc_url_foto,
            color: sucursal.suc_color || "#44407a"
        }));
};

// O usando negocios:
export const getMarcasFromNegocios = (negocios: Negocio[]): Marca[] => {
    return negocios
        .filter(negocio => negocio.neg_activo === 1 && negocio.neg_url_foto)
        .map(negocio => ({
            id: negocio.neg_id,
            nombre: negocio.neg_nom,
            logo: negocio.neg_url_foto,
            color: negocio.neg_color || "#44407a"
        }));
};
*/

// 🔄 Función para crear loop infinito con los 3 logos reales
export const getMarcasParaSlider = (): Marca[] => {
    // Repetimos los 3 logos varias veces para crear efecto infinito sin huecos
    const repeticiones = 8; // 3 logos x 8 = 24 elementos total
    const marcasLoop: Marca[] = [];

    for (let i = 0; i < repeticiones; i++) {
        marcasLoop.push(...marcasReales);
    }

    return marcasLoop;
};

// Función legacy - mantenemos por compatibilidad pero no la usamos
export const getMarcasAleatorias = (cantidad: number = 8): Marca[] => {
    return getMarcasParaSlider().slice(0, cantidad);
};

// 📊 ESTADÍSTICAS
export const getEstadisticasMarcas = () => {
    return {
        totalMarcasReales: marcasReales.length,
        totalEnSlider: getMarcasParaSlider().length,
        repeticionesPorLogo: Math.ceil(getMarcasParaSlider().length / marcasReales.length)
    };
};