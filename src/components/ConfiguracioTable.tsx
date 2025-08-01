"use client";
import React, { useState } from 'react';
import { Edit, Save, X, } from 'lucide-react';
import Button from './ui/buttons/Button';
import { ConfiguracionInfoCard } from '../components/ConfiguracionInfoCard';
import { ConfiguracionPerfilCard } from '../components/ConfiguracionPerfilCard';
import { ConfiguracionLogoCard } from '../components/ConfiguracionLogoCard';
import { useUserProfile } from '@/hooks/userProfile';
import { useComercioData } from '@/hooks/useComercioEncargado';
// import { ConfiguracionGaleriaCard } from '../components/ConfiguracionGaleriaCard';

export const ConfiguracionTable: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);

    const { userData, isLoading: profileLoading } = useUserProfile();
    const { comercioData, loading: comercioDataLoading } = useComercioData();

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

    if (profileLoading || comercioDataLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Cargando configuración...</div>
            </div>
        );
    }
    
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
                        logoUrl={comercioData?.suc_url_foto}
                    />
                </div>

                {/* Información del Restaurante */}
                {comercioData && (
                    <ConfiguracionInfoCard
                        data={comercioData}
                        isEditing={isEditing}
                    />
                )}

                {/* Perfil del Encargado */}
                <ConfiguracionPerfilCard
                    data={userData}
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