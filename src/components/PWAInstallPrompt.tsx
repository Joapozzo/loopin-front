'use client';

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Verificar si ya está instalado
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Escuchar el evento beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Mostrar prompt después de 3 segundos
            setTimeout(() => {
                setShowInstallPrompt(true);
            }, 3000);
        };

        // Escuchar cuando se instala la app
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowInstallPrompt(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowInstallPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        // No mostrar de nuevo por 7 días
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    // No mostrar si ya está instalado o fue dismissado recientemente
    if (isInstalled || !showInstallPrompt || !deferredPrompt) {
        return null;
    }

    // Verificar si fue dismissado en los últimos 7 días
    const lastDismissed = localStorage.getItem('pwa-install-dismissed');
    if (lastDismissed) {
        const daysSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed < 7) {
            return null;
        }
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                            ¡Instala Loopin!
                        </h3>
                        <p className="text-gray-600 text-xs mt-1">
                            Accede más rápido desde tu pantalla de inicio
                        </p>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleInstallClick}
                        className="flex-1 bg-[var(--violet)] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--violet-dark)] transition-colors flex items-center justify-center gap-2"
                    >
                        <Download size={14} />
                        Instalar
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="px-3 py-2 text-gray-600 text-sm hover:text-gray-800 transition-colors"
                    >
                        Ahora no
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;