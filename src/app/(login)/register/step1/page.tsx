"use client";

import { ArrowRight, User, Hash, Phone, MapPin, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister, step1Schema, type Step1Data } from "@/context/RegisterContext";
import { useRegisterNavigation } from "@/hooks/useRegisterNavigation";
import { RegisterLayout } from "@/hooks/RegisterLayout";
import { StepHeader } from "@/components/StepHeader";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import { useState } from "react";
import SpinnerButton from "@/components/SpinnerButton";
import { useRouter } from "next/navigation";

export default function RegisterStep1() {
    const router = useRouter();
    const { data, updateStep1Data } = useRegister();
    const { goToStep2, goToLogin, goToHome } = useRegisterNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            dni: data.dni || "",
            celular: data.celular || "",
            provincia: data.provincia || "",
            localidad: data.localidad || "",
            fechaNacimiento: data.fechaNacimiento || "",
        },
        mode: "onChange"
    });

    const onSubmit = (formData: Step1Data) => {
        setIsLoading(true);
        updateStep1Data(formData);

        setTimeout(() => {
            // Ignorar verificación en goToStep2
            // y redirigir directamente:
            router.push("/register/step2");
            setIsLoading(false);
        }, 50);
    };


    return (
        <RegisterLayout onGoToLogin={goToLogin} onGoToHome={goToHome}>
            <StepHeader
                title="Datos personales"
                currentStep={1}
                totalSteps={2}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 lg:space-y-4">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            Nombre
                        </label>
                        <Input
                            {...register("nombre")}
                            type="text"
                            placeholder="Tu nombre"
                            icon={<User size={16} />}
                            variant={errors.nombre ? "error" : "default"}
                        />
                        {errors.nombre && (
                            <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            Apellido
                        </label>
                        <Input
                            {...register("apellido")}
                            type="text"
                            placeholder="Tu apellido"
                            icon={<User size={16} />}
                            variant={errors.apellido ? "error" : "default"}
                        />
                        {errors.apellido && (
                            <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>
                        )}
                    </div>
                </div>

                {/* DNI y Celular */}
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            DNI
                        </label>
                        <Input
                            {...register("dni")}
                            type="text"
                            placeholder="12345678"
                            icon={<Hash size={16} />}
                            variant={errors.dni ? "error" : "default"}
                        />
                        {errors.dni && (
                            <p className="text-red-500 text-xs mt-1">{errors.dni.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            Celular
                        </label>
                        <Input
                            {...register("celular")}
                            type="text"
                            placeholder="11 1234 5678"
                            icon={<Phone size={16} />}
                            variant={errors.celular ? "error" : "default"}
                        />
                        {errors.celular && (
                            <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>
                        )}
                    </div>
                </div>

                {/* Provincia y Localidad */}
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            Provincia
                        </label>
                        <Input
                            {...register("provincia")}
                            type="text"
                            placeholder="Buenos Aires"
                            icon={<MapPin size={16} />}
                            variant={errors.provincia ? "error" : "default"}
                        />
                        {errors.provincia && (
                            <p className="text-red-500 text-xs mt-1">{errors.provincia.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            Localidad
                        </label>
                        <Input
                            {...register("localidad")}
                            type="text"
                            placeholder="CABA"
                            icon={<MapPin size={16} />}
                            variant={errors.localidad ? "error" : "default"}
                        />
                        {errors.localidad && (
                            <p className="text-red-500 text-xs mt-1">{errors.localidad.message}</p>
                        )}
                    </div>
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                    <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                        Fecha de nacimiento
                    </label>
                    <Input
                        {...register("fechaNacimiento")}
                        type="date"
                        icon={<Calendar size={16} />}
                        variant={errors.fechaNacimiento ? "error" : "default"}
                    />
                    {errors.fechaNacimiento && (
                        <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento.message}</p>
                    )}
                </div>

                {/* Botón Siguiente */}
                <div className="pt-1 lg:pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        size="md"
                        rounded="full"
                        className="shadow-lg flex items-center justify-center flex-shrink-0"
                        disabled={!isValid || isLoading}
                    >
                        {isLoading ? <><SpinnerButton /> <span className="ml-2 text-sm lg:text-base">Cargando...</span> </> : <span className="text-sm lg:text-base">Siguiente</span>}
                        <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </form>
        </RegisterLayout>
    );
}