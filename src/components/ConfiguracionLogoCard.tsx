import React from 'react';
import { Camera, Upload } from 'lucide-react';
import Button from './ui/buttons/Button'; 
import { logger } from '@/utils/logger';

interface ConfiguracionLogoCardProps {
    logoUrl: string;
}

export const ConfiguracionLogoCard: React.FC<ConfiguracionLogoCardProps> = ({
    logoUrl
}) => {
    const handleLogoChange = () => {
        // TODO: Implementar cambio de logo
        logger.log('Cambiar logo');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
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

            <div className="space-y-4">
                {/* Vista previa del logo actual */}
                <div className="flex flex-col items-center">
                    <div className="w-full h-52 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 overflow-hidden">
                        {logoUrl ? (
                            <img 
                                src={logoUrl} 
                                alt="Logo del restaurante"
                                className="w-full h-full object-cover rounded-lg"
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
                        className="flex items-center w-full justify-center"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Cambiar Logo
                    </Button>
                </div>

                {/* Información adicional */}
                <div className="bg-violet-200 border border-violet-300 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-violet-900 mb-2">
                        Recomendaciones para el logo:
                    </h4>
                    <ul className="text-sm text-violet-800 space-y-1">
                        <li>• Formato: PNG, JPG o SVG</li>
                        <li>• Tamaño recomendado: 300x300px</li>
                        <li>• Fondo transparente preferible</li>
                        <li>• Máximo 2MB de tamaño</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};