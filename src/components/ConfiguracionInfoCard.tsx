import React from 'react';
import { Store, MapPin, Palette, Coins } from 'lucide-react';
import Input from './ui/inputs/Input'; 

interface ConfiguracionInfoCardProps {
    data: {
        suc_nom: string;
        suc_dir: string;
        suc_relacion_puntos: string;
        suc_color: string;
    };
    isEditing: boolean;
}

export const ConfiguracionInfoCard: React.FC<ConfiguracionInfoCardProps> = ({
    data,
    isEditing
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[var(--violet)] rounded-lg flex items-center justify-center">
                    <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Información del Restaurante
                    </h3>
                    <p className="text-sm text-gray-500">
                        Datos principales del establecimiento
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Nombre del Restaurante */}
                <div>
                    {isEditing ? (
                        <Input
                            type="text"
                            label="Nombre del Restaurante"
                            defaultValue={data.suc_nom}
                        />
                    ) : (
                        <Input
                            type="text"
                            label="Nombre del Restaurante"
                            value={data.suc_nom}
                            disabled
                            readOnly
                        />
                    )}
                </div>

                {/* Dirección */}
                <div>
                    {isEditing ? (
                        <Input
                            type="text"
                            label="Dirección"
                            icon={<MapPin />}
                            defaultValue={data.suc_dir}
                        />
                    ) : (
                        <Input
                            type="text"
                            label="Dirección"
                            icon={<MapPin />}
                            value={data.suc_dir}
                            disabled
                            readOnly
                        />
                    )}
                </div>

                {/* Relación de Puntos */}
                <div>
                    {isEditing ? (
                        <Input
                            type="number"
                            label="Relación de Puntos ($1 = X puntos)"
                            icon={<Coins />}
                            step="0.01"
                            defaultValue={data.suc_relacion_puntos}
                        />
                    ) : (
                        <Input
                            type="text"
                            label="Relación de Puntos ($1 = X puntos)"
                            icon={<Coins />}
                            value={`${data.suc_relacion_puntos} puntos por peso`}
                            disabled
                            readOnly
                        />
                    )}
                </div>

                {/* Color del Tema */}
                <div>
                    {isEditing ? (
                        <>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Palette className="w-4 h-4 inline mr-1" />
                                Color del Tema
                            </label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="color"
                                    defaultValue={data.suc_color}
                                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                />
                                <Input
                                    type="text"
                                    defaultValue={data.suc_color}
                                    className="flex-1"
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Palette className="w-4 h-4 inline mr-1" />
                                Color del Tema
                            </label>
                            <div className="flex items-center space-x-3">
                                <div 
                                    className="w-12 h-10 rounded border border-gray-300"
                                    style={{ backgroundColor: data.suc_color }}
                                ></div>
                                <Input
                                    type="text"
                                    value={data.suc_color}
                                    disabled
                                    readOnly
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};