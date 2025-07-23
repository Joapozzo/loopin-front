"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


const NotFoundPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const goHome = () => {
        router.push('/');
    };

    const goBack = () => {
        window.history.back();
    };

    return (
        <>
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className={`text-center max-w-2xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>

                    {/* Número 404 grande */}
                    <div className="relative mb-8">
                        <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-violet-100 select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-violet-50 rounded-full flex items-center justify-center animate-bounce-slow">
                                <span className="text-3xl sm:text-4xl md:text-5xl text-violet-500">🔍</span>
                            </div>
                        </div>
                    </div>

                    {/* Mensaje principal */}
                    <div className="mb-8 space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-violet-500 tracking-tight">
                            ¡Oops! Página no encontrada
                        </h2>
                        <p className="text-lg sm:text-xl text-violet-400 max-w-lg mx-auto leading-relaxed">
                            La página que estás buscando no existe o fue movida a otro lugar.
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={goHome}
                            className="w-full sm:w-auto px-8 py-3 bg-violet-500 text-white rounded-xl font-medium hover:bg-violet-600 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        >
                            Volver al inicio
                        </button>
                        <button
                            onClick={goBack}
                            className="w-full sm:w-auto px-8 py-3 border-2 border-violet-200 text-violet-500 rounded-xl font-medium hover:border-violet-300 hover:bg-violet-50 transition-all duration-200"
                        >
                            Página anterior
                        </button>
                    </div>

                    {/* Elementos decorativos */}
                    <div className="mt-16 flex justify-center space-x-8">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 bg-violet-300 rounded-full animate-pulse`}
                                style={{ animationDelay: `${i * 0.3}s` }}
                            ></div>
                        ))}
                    </div>

                    {/* Sugerencias */}
                    <div className="mt-12 p-6 bg-violet-50 rounded-2xl">
                        <h3 className="text-lg font-semibold text-violet-500 mb-3">
                            ¿Qué puedes hacer?
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-violet-400">
                            <div className="flex items-center space-x-2">
                                <span className="text-violet-500">✓</span>
                                <span>Verificar la URL</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-violet-500">✓</span>
                                <span>Usar el menú de navegación</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-violet-500">✓</span>
                                <span>Contactar soporte</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-violet-500">✓</span>
                                <span>Volver más tarde</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes bounce-slow {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
        </>
    );
};

export default NotFoundPage;