'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from "@/auth/firebase";
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, XCircle, AlertCircle, Key } from "lucide-react";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import toast from "react-hot-toast";
import Image from "next/image";
import SpinnerLoader from "@/components/ui/SpinerLoader";
import { logger } from '@/utils/logger';

export default function AuthContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
    const [error, setError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!mode || !oobCode) return;

        setStatus('processing');

        if (mode === 'verifyEmail') {
            applyActionCode(auth, oobCode)
                .then(() => {
                    setStatus('done');
                    toast.success('Email verificado correctamente');
                })
                .catch((err) => {
                    logger.error('Error verifying email:', err);
                    setError('No se pudo verificar el correo. El enlace puede haber expirado.');
                    setStatus('error');
                    toast.error('Error al verificar el email');
                });
        }

        if (mode === 'resetPassword') {
            verifyPasswordResetCode(auth, oobCode)
                .then(() => {
                    setShowPasswordForm(true);
                    setStatus('idle');
                })
                .catch((err) => {
                    logger.error('Error verifying reset code:', err);
                    setError('El enlace para restablecer la contraseña no es válido o ha expirado.');
                    setStatus('error');
                    toast.error('Enlace inválido o expirado');
                });
        }
    }, [mode, oobCode]);

    const handlePasswordReset = async () => {
        if (!newPassword) {
            toast.error('Ingresá una nueva contraseña');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Restableciendo contraseña...');

        try {
            await confirmPasswordReset(auth, oobCode!, newPassword);
            setStatus('done');
            toast.success('Contraseña restablecida correctamente', { id: toastId });

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            logger.error('Error resetting password:', err);
            let errorMessage = 'Error al restablecer la contraseña';

            if (err.code === 'auth/weak-password') {
                errorMessage = 'La contraseña es muy débil';
            }

            setError(errorMessage);
            setStatus('error');
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'processing':
                return <SpinnerLoader color="text-[var(--violet)]" size="h-8 w-8" />;
            case 'done':
                return <CheckCircle className="w-16 h-16 text-green-500" />;
            case 'error':
                return <XCircle className="w-16 h-16 text-red-500" />;
            default:
                return <Key className="w-16 h-16 text-[var(--violet)]" />;
        }
    };

    const getStatusMessage = () => {
        if (status === 'processing') {
            return mode === 'verifyEmail' ? 'Verificando tu email...' : 'Verificando enlace...';
        }

        if (status === 'done') {
            if (mode === 'verifyEmail') {
                return 'Tu email ha sido verificado correctamente. Ya podés iniciar sesión.';
            }
            if (mode === 'resetPassword') {
                return 'Tu contraseña ha sido restablecida correctamente. Serás redirigido al login.';
            }
        }

        if (status === 'error') {
            return error;
        }

        if (showPasswordForm) {
            return 'Ingresá tu nueva contraseña para completar el restablecimiento.';
        }

        return 'Procesando tu solicitud...';
    };

    const goToLogin = () => {
        router.push('/login');
    };

    const goToHome = () => {
        router.push('/');
    };

    return (
        <div className="h-screen bg-gradient-to-br from-[var(--violet-50)] to-white flex items-center justify-center p-6">
            <style jsx>{`
                :root {
                    --violet: #8b5cf6;
                    --violet-50: #f3f0ff;
                    --violet-200: #c4b5fd;
                    --rose: #f43f5e;
                    --white: #ffffff;
                    --black: #1f2937;
                    --gray: #9ca3af;
                }
            `}</style>

            {/* Elementos decorativos */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-[var(--rose)]/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-[var(--violet)]/20 rounded-full animate-pulse delay-1000"></div>

            <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden z-10">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <Image
                                src="/logos/logo.svg"
                                alt="Logo Loopin"
                                className="h-8 w-auto"
                                width={120}
                                height={40}
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--violet)] mb-2">
                            {mode === 'verifyEmail' && 'Verificación de Email'}
                            {mode === 'resetPassword' && 'Restablecer Contraseña'}
                            {!mode && 'Autenticación'}
                        </h2>
                    </div>

                    {/* Contenido principal */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            {getStatusIcon()}
                        </div>

                        <p className="text-lg text-gray-700 mb-6">
                            {getStatusMessage()}
                        </p>

                        {/* Formulario para nueva contraseña */}
                        {showPasswordForm && status !== 'done' && (
                            <div className="max-w-md mx-auto space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--violet)] mb-2 text-left">
                                        Nueva contraseña
                                    </label>
                                    <div className="relative">
                                        <Input
                                            name="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Ingresá tu nueva contraseña"
                                            icon={<Lock />}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--violet)] hover:text-[var(--violet-200)]"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 text-left">
                                        La contraseña debe tener al menos 6 caracteres
                                    </p>
                                </div>

                                <Button
                                    onClick={handlePasswordReset}
                                    variant="primary"
                                    fullWidth
                                    size="md"
                                    rounded="full"
                                    disabled={isLoading || !newPassword || newPassword.length < 6}
                                    className="shadow-lg"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Restableciendo...</span>
                                        </div>
                                    ) : (
                                        "Restablecer contraseña"
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col space-y-4">
                        {status === 'done' && (
                            <Button
                                onClick={goToLogin}
                                variant="primary"
                                fullWidth
                                size="md"
                                rounded="full"
                                className="shadow-lg"
                            >
                                Ir al login
                            </Button>
                        )}

                        {status === 'error' && (
                            <div className="space-y-3">
                                <Button
                                    onClick={() => window.location.reload()}
                                    variant="primary"
                                    fullWidth
                                    size="md"
                                    rounded="full"
                                    className="shadow-lg"
                                >
                                    Intentar nuevamente
                                </Button>
                                <Button
                                    onClick={goToLogin}
                                    variant="outline"
                                    fullWidth
                                    size="md"
                                    rounded="full"
                                >
                                    Ir al login
                                </Button>
                            </div>
                        )}

                        {!mode && !oobCode && (
                            <div className="text-center">
                                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                    <p className="text-yellow-700">
                                        No hay ninguna acción de autenticación para procesar.
                                    </p>
                                </div>
                                <Button
                                    onClick={goToLogin}
                                    variant="primary"
                                    fullWidth
                                    size="md"
                                    rounded="full"
                                    className="shadow-lg"
                                >
                                    Ir al login
                                </Button>
                            </div>
                        )}

                        {/* Volver al inicio */}
                        <button
                            className="inline-flex items-center justify-center text-gray-500 hover:text-[var(--violet)] transition-colors text-sm"
                            onClick={goToHome}
                        >
                            <ArrowLeft size={16} className="mr-1" />
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}