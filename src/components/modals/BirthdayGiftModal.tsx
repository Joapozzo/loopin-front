"use client";

import { useAnimatedModal } from "@/hooks/useAnimatedModal";
import { useModalStore } from "@/stores/useModalStore";
import { CuponCumpleanos } from "@/types/codigos";
import { X, Gift, Calendar, Sparkles, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useCodigoGenerado } from "@/hooks/useCodigoGenerado";

// Componente de confetti mejorado
const ConfettiPiece = ({ delay, type = "square" }: { delay: number; type?: "square" | "circle" | "star" }) => {
    const colors = ['#7b61ff', '#8d76fe', '#ff6b81', '#ff8092', '#f8a5b2', '#FFD700', '#4ECDC4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomX = Math.random() * window.innerWidth;
    const randomDelay = delay + Math.random() * 0.5;

    return (
        <motion.div
            className={`absolute w-3 h-3 ${type === "circle" ? "rounded-full" : type === "star" ? "rounded-sm rotate-45" : "rounded-sm"}`}
            initial={{
                y: -20,
                x: randomX,
                rotate: 0,
                opacity: 1,
                scale: 0
            }}
            animate={{
                y: window.innerHeight + 50,
                x: randomX + (Math.random() - 0.5) * 300,
                rotate: 360 * 3,
                opacity: 0,
                scale: [0, 1, 1, 0]
            }}
            transition={{
                duration: 4,
                delay: randomDelay,
                ease: "easeOut"
            }}
            style={{ backgroundColor: randomColor }}
        />
    );
};

// Partículas de explosión del regalo
const ExplosionParticle = ({ delay, angle }: { delay: number; angle: number }) => {
    const colors = ['#7b61ff', '#8d76fe', '#ff6b81', '#ff8092', '#f8a5b2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
        <motion.div
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: randomColor }}
            initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 1
            }}
            animate={{
                x: Math.cos(angle) * 150,
                y: Math.sin(angle) * 150,
                scale: [0, 1, 0],
                opacity: [1, 1, 0]
            }}
            transition={{
                duration: 1.2,
                delay: delay,
                ease: "easeOut"
            }}
        />
    );
};

// Componente del regalo súper animado
const SuperAnimatedGift = ({ isOpening, onOpenComplete }: {
    isOpening: boolean;
    onOpenComplete: () => void;
}) => {
    const [showExplosion, setShowExplosion] = useState(false);

    useEffect(() => {
        if (isOpening) {
            // Mostrar explosión después de 0.8s
            const explosionTimer = setTimeout(() => setShowExplosion(true), 800);
            // Completar después de 2s
            const completeTimer = setTimeout(onOpenComplete, 2000);

            return () => {
                clearTimeout(explosionTimer);
                clearTimeout(completeTimer);
            };
        }
    }, [isOpening, onOpenComplete]);

    return (
        <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Partículas de explosión */}
            {showExplosion && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(20)].map((_, i) => (
                        <ExplosionParticle
                            key={i}
                            delay={i * 0.05}
                            angle={(i / 20) * Math.PI * 2}
                        />
                    ))}
                </div>
            )}

            {/* Base del regalo con sombra */}
            <motion.div
                className="absolute inset-2 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl shadow-2xl"
                animate={isOpening ? {
                    scale: [1, 1.1, 1.05],
                    rotate: [0, -3, 3, -2, 2, 0],
                    y: [0, -10, 0]
                } : {
                    y: [0, -5, 0],
                    scale: [1, 1.02, 1]
                }}
                transition={{
                    duration: isOpening ? 0.8 : 2,
                    ease: "easeInOut",
                    repeat: isOpening ? 0 : Infinity
                }}
                style={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(255,107,129,0.3)'
                }}
            />

            {/* Cinta horizontal con brillo */}
            <motion.div
                className="absolute top-1/2 left-1 right-1 h-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 transform -translate-y-1/2 shadow-lg"
                animate={isOpening ? {
                    scaleX: [1, 0.8, 0],
                    opacity: [1, 0.5, 0],
                    rotateY: [0, 90, 180]
                } : {
                    boxShadow: [
                        '0 0 10px rgba(255,215,0,0.5)',
                        '0 0 20px rgba(255,215,0,0.8)',
                        '0 0 10px rgba(255,215,0,0.5)'
                    ]
                }}
                transition={{
                    duration: isOpening ? 0.6 : 2,
                    delay: isOpening ? 0.3 : 0,
                    repeat: isOpening ? 0 : Infinity
                }}
            />

            {/* Cinta vertical con brillo */}
            <motion.div
                className="absolute left-1/2 top-1 bottom-1 w-6 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400 transform -translate-x-1/2 shadow-lg"
                animate={isOpening ? {
                    scaleY: [1, 0.8, 0],
                    opacity: [1, 0.5, 0],
                    rotateX: [0, 90, 180]
                } : {
                    boxShadow: [
                        '0 0 10px rgba(255,215,0,0.5)',
                        '0 0 20px rgba(255,215,0,0.8)',
                        '0 0 10px rgba(255,215,0,0.5)'
                    ]
                }}
                transition={{
                    duration: isOpening ? 0.6 : 2,
                    delay: isOpening ? 0.3 : 0,
                    repeat: isOpening ? 0 : Infinity
                }}
            />

            {/* Tapa del regalo con efecto 3D */}
            <motion.div
                className="absolute -top-1 left-3 right-3 h-8 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-2xl shadow-xl"
                animate={isOpening ? {
                    y: [-4, -80, -120],
                    rotateX: [0, -45, -90],
                    rotateZ: [0, 15, 30],
                    opacity: [1, 0.8, 0],
                    scale: [1, 1.1, 1.3]
                } : {
                    y: [-4, -8, -4],
                    rotateX: [0, -5, 0]
                }}
                transition={{
                    duration: isOpening ? 1.2 : 3,
                    delay: isOpening ? 0.5 : 0,
                    ease: isOpening ? "easeOut" : "easeInOut",
                    repeat: isOpening ? 0 : Infinity
                }}
                style={{
                    transformStyle: 'preserve-3d'
                }}
            />

            {/* Moño súper animado */}
            <motion.div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                animate={isOpening ? {
                    y: [-24, -100, -150],
                    scale: [1, 1.2, 0],
                    rotate: [0, 180, 360],
                    opacity: [1, 0.8, 0]
                } : {
                    y: [-24, -28, -24],
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                }}
                transition={{
                    duration: isOpening ? 1.2 : 4,
                    delay: isOpening ? 0.5 : 0,
                    ease: "easeInOut",
                    repeat: isOpening ? 0 : Infinity
                }}
            >
                <div className="relative">
                    {/* Centro del moño */}
                    <div className="w-10 h-8 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full shadow-lg" />
                    {/* Lado izquierdo */}
                    <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full transform -translate-y-1/2 shadow-md" />
                    {/* Lado derecho */}
                    <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full transform -translate-y-1/2 shadow-md" />
                    {/* Brillo del moño */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"
                        animate={{
                            opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </motion.div>

            {/* Destellos mágicos alrededor del regalo */}
            {!isOpening && (
                <>
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: `rotate(${i * 45}deg) translateY(-60px)`
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0]
                            }}
                            transition={{
                                duration: 2,
                                delay: i * 0.2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

// Card de cupón rediseñada
const BirthdayCuponCard = ({ cupon, index }: { cupon: CuponCumpleanos; index: number }) => (
    <motion.div
        className="bg-gradient-to-br from-violet-500 via-rose to-violet-600 text-white rounded-2xl p-5 shadow-xl border border-white/20"
        initial={{ opacity: 0, scale: 0.8, y: 50, rotateY: -90 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
        transition={{
            duration: 0.8,
            delay: index * 0.15,
            type: "spring",
            damping: 15
        }}
        whileHover={{
            scale: 1.03,
            y: -5,
            rotateY: 5,
            transition: { duration: 0.2 }
        }}
        style={{
            background: 'linear-gradient(135deg, var(--violet) 0%, var(--rose) 50%, var(--violet-200) 100%)',
            boxShadow: '0 20px 40px rgba(123,97,255,0.3), 0 0 20px rgba(255,107,129,0.2)'
        }}
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
                <Gift size={20} className="text-white/80" />
                <h3 className="text-sm font-bold text-white/90">
                    REGALO DE CUMPLEAÑOS
                </h3>
            </div>
            <motion.div
                animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Sparkles className="text-yellow-300" size={22} />
            </motion.div>
        </div>

        <div className="mb-4">
            <h4 className="text-xl font-bold leading-tight mb-2">
                {cupon.pro_nom}
            </h4>
            <p className="text-white/80 text-sm flex items-center gap-1">
                <Star size={14} />
                Válido en {cupon.suc_nom}
            </p>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 mb-4 border border-white/20">
            <p className="text-xs font-medium text-white/80 mb-2">Código del regalo:</p>
            <motion.p
                className="text-lg font-mono font-bold tracking-wider text-center bg-white/20 rounded-lg py-2 px-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
            >
                {cupon.cod_prom_publico}
            </motion.p>
        </div>

        <div className="flex items-center justify-between text-sm text-white/80">
            <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Hasta: {new Date(cupon.cod_prom_fecha_expiracion).toLocaleDateString()}</span>
            </div>
            <div className="bg-white/20 rounded-full px-3 py-1">
                Usos: {cupon.cod_prom_uso_max}
            </div>
        </div>
    </motion.div>
);

export default function BirthdayGiftModal() {
    const isBirthdayModalOpen = useModalStore((state) => state.modalType === "birthday-gift");
    const closeBirthdayModal = useModalStore((state) => state.closeModal);

    const { isMounted, isClosing, handleClose } = useAnimatedModal(isBirthdayModalOpen, closeBirthdayModal);

    const [giftOpened, setGiftOpened] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCoupons, setShowCoupons] = useState(false);

    // 🎂 Hook para cupones de cumpleaños
    const {
        cuponesCumpleanos,
        loadingCumpleanos,
        errorCumpleanos,
        cargarCuponesCumpleanos
    } = useCodigoGenerado(
        null, // producto
        'activos', // tipo
        null, // neg_id
        null, // suc_id
        false, // enableCodigosPromocionales
        false, // autoGenerate
        true // enableCuponesCumpleanos = true ✅
    );

    // Reset state when modal opens
    useEffect(() => {
        if (isBirthdayModalOpen) {
            setGiftOpened(false);
            setShowConfetti(false);
            setShowCoupons(false);
            // Recargar cupones cuando se abre el modal
            cargarCuponesCumpleanos();
        }
    }, [isBirthdayModalOpen, cargarCuponesCumpleanos]);

    const handleGiftClick = () => {
        setGiftOpened(true);
        setShowConfetti(true);
    };

    const handleOpenComplete = () => {
        setShowCoupons(true);
    };

    if (!isBirthdayModalOpen) return null;

    // Determinar el estado y mensaje según los cupones
    const getBirthdayMessage = () => {
        if (loadingCumpleanos) {
            return {
                title: "Verificando regalos...",
                subtitle: "Revisando si tienes sorpresas de cumpleaños",
                type: "loading"
            };
        }

        if (errorCumpleanos) {
            return {
                title: "¡Oops!",
                subtitle: "No pudimos verificar tus regalos de cumpleaños",
                type: "error"
            };
        }

        if (cuponesCumpleanos.length === 0) {
            return {
                title: "¡Aún no tienes regalos!",
                subtitle: "Los regalos de cumpleaños aparecen en tu mes especial",
                type: "empty"
            };
        }

        return {
            title: giftOpened ? "¡Feliz Cumpleaños! 🎉" : "¡Tienes un regalo!",
            subtitle: giftOpened
                ? `${cuponesCumpleanos.length} regalo${cuponesCumpleanos.length > 1 ? 's' : ''} especial${cuponesCumpleanos.length > 1 ? 'es' : ''} para ti`
                : "Toca el regalo para descubrir tu sorpresa",
            type: "gift"
        };
    };

    const message = getBirthdayMessage();

    return (
        <AnimatePresence>
            {isBirthdayModalOpen && (
                <div
                    className={`fixed inset-0 z-9999 flex items-start justify-center transition-all duration-500 ${isMounted ? "opacity-100" : "opacity-0"
                        } ${isClosing ? "backdrop-blur-none bg-black/0" : "backdrop-blur-md bg-black/60"}`}
                    onClick={handleClose}
                >
                    {/* Confetti súper mejorado */}
                    {showConfetti && (
                        <div className="fixed inset-0 pointer-events-none overflow-hidden">
                            {[...Array(100)].map((_, i) => (
                                <ConfettiPiece
                                    key={i}
                                    delay={i * 0.02}
                                    type={i % 3 === 0 ? "circle" : i % 3 === 1 ? "star" : "square"}
                                />
                            ))}
                        </div>
                    )}

                    {/* Modal desde arriba */}
                    <motion.div
                        className="relative bg-white w-full shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto"
                        style={{
                            borderBottomLeftRadius: '3rem',
                            borderBottomRightRadius: '3rem'
                        }}
                        initial={{ y: "-100%", opacity: 0 }}
                        animate={{
                            y: isMounted && !isClosing ? "0%" : "-100%",
                            opacity: isMounted && !isClosing ? 1 : 0
                        }}
                        transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 200,
                            duration: 0.8
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header con gradiente de la app */}
                        <div
                            className="p-8 relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, var(--violet) 0%, var(--rose) 100%)'
                            }}
                        >
                            {/* Elementos decorativos de fondo */}
                            <div className="absolute inset-0 opacity-20">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 bg-white rounded-full"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                        }}
                                        animate={{
                                            scale: [0, 1, 0],
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{
                                            duration: 3,
                                            delay: i * 0.2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>

                            <button
                                className="absolute top-6 right-6 text-white/80 hover:text-white hover:scale-110 transition-all duration-200 z-20"
                                onClick={handleClose}
                            >
                                <X size={28} />
                            </button>

                            <div className="text-center text-white relative z-10">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, type: "spring", damping: 12 }}
                                    className="mb-6"
                                >
                                    <Gift size={60} className="mx-auto text-yellow-300 drop-shadow-lg" />
                                </motion.div>

                                <motion.h2
                                    className="text-3xl font-bold mb-3 drop-shadow-lg"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    {message.title}
                                </motion.h2>

                                <motion.p
                                    className="text-white/90 text-lg"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                >
                                    {message.subtitle}
                                </motion.p>
                            </div>
                        </div>

                        {/* Content */}
                        {
                            cuponesCumpleanos.length > 0 &&
                            <div className="p-8 bg-white">
                                {message.type === "loading" && (
                                    <div className="text-center">
                                        <motion.div
                                            className="w-16 h-16 border-4 border-violet rounded-full border-t-transparent mx-auto mb-6"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <p className="text-gray-600 text-lg">Cargando regalos mágicos...</p>
                                    </div>
                                )}

                                {message.type === "error" && (
                                    <div className="text-center">
                                        <motion.div
                                            className="text-rose mb-6"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", damping: 10 }}
                                        >
                                            <X size={60} className="mx-auto" />
                                        </motion.div>
                                        <p className="text-gray-600 mb-6 text-lg">Algo salió mal con la magia...</p>
                                        <motion.button
                                            onClick={cargarCuponesCumpleanos}
                                            className="px-6 py-3 bg-gradient-to-r from-violet to-rose text-white rounded-2xl font-semibold shadow-lg"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{ boxShadow: '0 10px 30px rgba(123,97,255,0.3)' }}
                                        >
                                            Intentar de nuevo
                                        </motion.button>
                                    </div>
                                )}

                                {message.type === "empty" && (
                                    <div className="text-center">
                                        <motion.div
                                            className="text-gray-400 mb-6"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", damping: 15 }}
                                        >
                                            <Calendar size={60} className="mx-auto" />
                                        </motion.div>
                                        <p className="text-gray-600 text-lg">Los regalos mágicos aparecen en tu mes especial</p>
                                    </div>
                                )}

                                {message.type === "gift" && (
                                    <div className="space-y-8">
                                        {!giftOpened && (
                                            <motion.div
                                                className="cursor-pointer"
                                                onClick={handleGiftClick}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <SuperAnimatedGift
                                                    isOpening={giftOpened}
                                                    onOpenComplete={handleOpenComplete}
                                                />
                                                <motion.p
                                                    className="text-center text-gray-600 font-medium"
                                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    ¡Toca para abrir! ✨
                                                </motion.p>
                                            </motion.div>
                                        )}

                                        {giftOpened && (
                                            <motion.div
                                                className="space-y-6"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                {cuponesCumpleanos.map((cupon, index) => (
                                                    <BirthdayCuponCard
                                                        key={cupon.cod_prom_publico}
                                                        cupon={cupon}
                                                        index={index}
                                                    />
                                                ))}
                                            </motion.div>
                                        )}

                                        {cuponesCumpleanos.length === 0 && (
                                            <div className="text-center">
                                                <SuperAnimatedGift
                                                    isOpening={false}
                                                    onOpenComplete={() => { }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        }
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}