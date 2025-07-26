import React from 'react';
import { User, Mail, Phone, CreditCard, Calendar, MapPin } from 'lucide-react';
import Input from './ui/inputs/Input'; 

interface ConfiguracionPerfilCardProps {
    data: {
        usu_username: string;
        usu_mail: string;
        usu_cel: string;
        usu_dni: string;
        cli_nom: string;
        cli_ape: string;
        cli_fec_nac: string | null;
        loc_nom: string;
    };
    isEditing: boolean;
}

export const ConfiguracionPerfilCard: React.FC<ConfiguracionPerfilCardProps> = ({
    data,
    isEditing
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[var(--violet)] rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Perfil del Encargado
                    </h3>
                    <p className="text-sm text-gray-500">
                        Información personal del responsable
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {isEditing ? (
                            <Input
                                type="text"
                                label="Nombre"
                                defaultValue={data.cli_nom}
                                allowOnlyLetters
                            />
                        ) : (
                            <Input
                                type="text"
                                label="Nombre"
                                value={data.cli_nom}
                                disabled
                                readOnly
                            />
                        )}
                    </div>
                    <div>
                        {isEditing ? (
                            <Input
                                type="text"
                                label="Apellido"
                                defaultValue={data.cli_ape}
                                allowOnlyLetters
                            />
                        ) : (
                            <Input
                                type="text"
                                label="Apellido"
                                value={data.cli_ape}
                                disabled
                                readOnly
                            />
                        )}
                    </div>
                </div>

                {/* Usuario */}
                <div>
                    {isEditing ? (
                        <Input
                            type="text"
                            label="Usuario"
                            icon={<User />}
                            defaultValue={data.usu_username}
                        />
                    ) : (
                        <Input
                            type="text"
                            label="Usuario"
                            icon={<User />}
                            value={`@${data.usu_username}`}
                            disabled
                            readOnly
                        />
                    )}
                </div>

                {/* Email */}
                <div>
                    {isEditing ? (
                        <Input
                            type="email"
                            label="Email"
                            icon={<Mail />}
                            defaultValue={data.usu_mail}
                        />
                    ) : (
                        <Input
                            type="email"
                            label="Email"
                            icon={<Mail />}
                            value={data.usu_mail}
                            disabled
                            readOnly
                        />
                    )}
                </div>

                {/* Teléfono y DNI */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {isEditing ? (
                            <Input
                                type="tel"
                                label="Teléfono"
                                icon={<Phone />}
                                defaultValue={data.usu_cel}
                                allowOnlyNumbers
                            />
                        ) : (
                            <Input
                                type="tel"
                                label="Teléfono"
                                icon={<Phone />}
                                value={data.usu_cel}
                                disabled
                                readOnly
                            />
                        )}
                    </div>
                    <div>
                        {isEditing ? (
                            <Input
                                type="text"
                                label="DNI"
                                icon={<CreditCard />}
                                defaultValue={data.usu_dni}
                                allowOnlyNumbers
                            />
                        ) : (
                            <Input
                                type="text"
                                label="DNI"
                                icon={<CreditCard />}
                                value={data.usu_dni}
                                disabled
                                readOnly
                            />
                        )}
                    </div>
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                    {isEditing ? (
                        <Input
                            type="date"
                            label="Fecha de Nacimiento"
                            icon={<Calendar />}
                            defaultValue={data.cli_fec_nac || ''}
                        />
                    ) : (
                        <Input
                            type="text"
                            label="Fecha de Nacimiento"
                            icon={<Calendar />}
                            value={data.cli_fec_nac || 'No especificada'}
                            disabled
                            readOnly
                        />
                    )}
                </div>

                {/* Localidad */}
                <div>
                    {isEditing ? (
                        <Input
                            type="text"
                            label="Localidad"
                            icon={<MapPin />}
                            defaultValue={data.loc_nom}
                        />
                    ) : (
                        <Input
                            type="text"
                            label="Localidad"
                            icon={<MapPin />}
                            value={data.loc_nom}
                            disabled
                            readOnly
                        />
                    )}
                </div>
            </div>
        </div>
    );
};