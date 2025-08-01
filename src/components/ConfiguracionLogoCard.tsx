import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import Button from './ui/buttons/Button';
import { useSucursales } from '@/hooks/useSucursales';
import { useToast } from '@/hooks/useToast';
import Image from 'next/image';

interface ConfiguracionLogoCardProps {
    logoUrl: string | undefined;
}

export const ConfiguracionLogoCard: React.FC<ConfiguracionLogoCardProps> = ({
    logoUrl
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { updateSucursalPhoto, refresh } = useSucursales({});
    const { showToast } = useToast();

    const validateFile = (file: File): string | null => {
        // Solo PNG
        if (file.type !== 'image/png') {
            return 'Solo se permiten archivos PNG';
        }

        // Máximo 2MB
        if (file.size > 2 * 1024 * 1024) {
            return 'El archivo debe ser menor a 2MB';
        }

        return null;
    };

    const handleLogoChange = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar archivo
        const validationError = validateFile(file);
        if (validationError) {
            showToast(validationError, 'error');
            return;
        }

        setIsUploading(true);

        try {
            const response = await updateSucursalPhoto(file);
            showToast(response.mensaje || 'Logo actualizado exitosamente', 'success');
            await refresh(); // Refrescar datos
        } catch (error: any) {
            console.error('Error updating logo:', error);
            showToast(
                error.message || 'Error al actualizar el logo',
                'error'
            );
        } finally {
            setIsUploading(false);
            // Limpiar el input para permitir seleccionar el mismo archivo otra vez
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[var(--violet-200)] rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Logo del Restaurante
                    </h3>
                    <p className="text-sm text-gray-500">
                        Imagen principal de tu establecimiento
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lado izquierdo - Imagen y botón */}
                <div className="space-y-4">
                    {/* Vista previa del logo actual */}
                    <div className="w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt="Logo del restaurante"
                                className="object-contain max-w-[100px] max-h-[120px]"
                                width={120}
                                height={40}
                            />
                        ) : (
                            <div className="text-center text-gray-400">
                                <Camera className="w-8 h-8 mx-auto mb-2" />
                                <span className="text-sm">Sin logo</span>
                            </div>
                        )}
                    </div>


                    <Button
                        onClick={handleLogoChange}
                        disabled={isUploading}
                        className="flex items-center w-full justify-center"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? 'Subiendo...' : 'Cambiar Logo'}
                    </Button>

                    {/* Input de archivo oculto */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* Lado derecho - Requisitos */}
                <div className="flex flex-col justify-beetwen h-full">
                    <div className="bg-violet-200 border border-violet-300 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-violet-900 mb-3">
                            Requisitos para el logo:
                        </h4>
                        <ul className="text-sm text-violet-800 space-y-2">
                            <li>• Formato: PNG únicamente</li>
                            <li>• Tamaño recomendado: 300x300px</li>
                            <li>• Fondo transparente preferible</li>
                            <li>• Máximo 2MB de tamaño</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};