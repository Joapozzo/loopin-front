import React from 'react';
import { Images, Plus, X } from 'lucide-react';
import Button from './ui/buttons/Button'; 

interface ConfiguracionGaleriaCardProps {
    imagenes: string[];
}

export const ConfiguracionGaleriaCard: React.FC<ConfiguracionGaleriaCardProps> = ({
    imagenes
}) => {
    const handleAgregarImagen = () => {
        // TODO: Implementar agregar imagen
        console.log('Agregar imagen');
    };

    const handleEliminarImagen = (index: number) => {
        // TODO: Implementar eliminar imagen
        console.log('Eliminar imagen', index);
    };

    const maxImagenes = 4;
    const imagenesRestantes = maxImagenes - imagenes.length;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Images className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Galería del Restaurante
                    </h3>
                    <p className="text-sm text-gray-500">
                        Imágenes de tu local (máximo {maxImagenes})
                    </p>
                </div>
                {imagenesRestantes > 0 && (
                    <Button
                        onClick={handleAgregarImagen}
                        className="flex items-center text-sm"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {/* Grid de imágenes */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Imágenes existentes */}
                    {imagenes.map((imagen, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={imagen}
                                    alt={`Imagen ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => handleEliminarImagen(index)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {/* Espacios vacíos */}
                    {Array.from({ length: imagenesRestantes }).map((_, index) => (
                        <div
                            key={`empty-${index}`}
                            className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={handleAgregarImagen}
                        >
                            <div className="text-center text-gray-400">
                                <Plus className="w-6 h-6 mx-auto mb-1" />
                                <span className="text-xs">Agregar</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contador */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{imagenes.length} de {maxImagenes} imágenes</span>
                    {imagenesRestantes === 0 && (
                        <span className="text-orange-600 font-medium">
                            Límite alcanzado
                        </span>
                    )}
                </div>

                {/* Información adicional */}
                <div className="bg-violet-200 border border-violet-300 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-violet-900 mb-2">
                        Consejos para las imágenes:
                    </h4>
                    <ul className="text-sm text-violet-900 space-y-1">
                        <li>• Muestra el ambiente y decoración</li>
                        <li>• Incluye fotos de tus platos destacados</li>
                        <li>• Buena iluminación y calidad</li>
                        <li>• Formato: JPG o PNG, máximo 5MB cada una</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};