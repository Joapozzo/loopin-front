"use client";
import React, { useState } from 'react';
import { Edit, Save, X, } from 'lucide-react';
import Button from './ui/buttons/Button';
import { ConfiguracionInfoCard } from '../components/ConfiguracionInfoCard';
import { ConfiguracionPerfilCard } from '../components/ConfiguracionPerfilCard';
import { ConfiguracionLogoCard } from '../components/ConfiguracionLogoCard';
import { ConfiguracionGaleriaCard } from '../components/ConfiguracionGaleriaCard';

export const ConfiguracionTable: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);

    // Datos estáticos del restaurante
    const restauranteData = {
        suc_nom: "Loopin Sucursal",
        suc_dir: "Dir",
        suc_url_foto: "https://firebasestorage.googleapis.com/v0/b/loopinservices.firebasestorage.app/o/URL?alt=media",
        suc_relacion_puntos: "1.00",
        suc_color: "#FFFFF"
    };

    // Datos estáticos del encargado
    const encargadoData = {
        usu_username: "joapozzo",
        usu_mail: "pozzojoa@gmail.com",
        usu_cel: "351",
        usu_dni: "4520",
        cli_nom: "Joa",
        cli_ape: "Pozzo",
        cli_fec_nac: null,
        loc_nom: "Córdoba Capital"
    };

    // Galería de imágenes (estática)
    const galeria = [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400"
    ];

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // TODO: Implementar guardado
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--violet)]">
                                Configuración del Restaurante
                            </h2>
                            <p className="text-sm text-[var(--violet-200)] mt-1">
                                Gestiona la información y configuración de tu establecimiento
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            {!isEditing ? (
                                <Button className="flex items-center">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar Información
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        onClick={handleSave}
                                        className="flex items-center bg-green-600 hover:bg-green-700"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Guardar
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        className="flex items-center bg-gray-600 hover:bg-gray-700"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancelar
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Logo del Restaurante - Ocupa toda la fila */}
                <div className="lg:col-span-2">
                    <ConfiguracionLogoCard
                        logoUrl={restauranteData.suc_url_foto}
                    />
                </div>

                {/* Información del Restaurante */}
                <ConfiguracionInfoCard
                    data={restauranteData}
                    isEditing={isEditing}
                />

                {/* Perfil del Encargado */}
                <ConfiguracionPerfilCard
                    data={encargadoData}
                    isEditing={isEditing}
                />

                {/* Galería de Imágenes */}
                {/* <ConfiguracionGaleriaCard
                    imagenes={galeria}
                /> */}
            </div>
        </div>
    );
};