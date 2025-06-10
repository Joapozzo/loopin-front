import { EyeOff } from "lucide-react";

interface FrenteCardProps {
    onToggle: () => void;
    isVisible: boolean;
    isFlipping: boolean;
}

export default function FrenteCard({ onToggle, isVisible, isFlipping }: FrenteCardProps) {
    return (
        <div 
            className={`absolute inset-0 bg-[var(--black)] py-4 px-8 rounded-lg flex flex-col gap-4 items-start justify-center transition-all duration-500 ${
                isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{
                transform: isVisible ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
            }}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex flex-col items-start justify-center">
                    <p className="text-xl font-semibold">*************</p>
                    <p className="text-md text-[var(--foreground)]">********</p>
                </div>
                <button 
                    onClick={onToggle}
                    className="hover:bg-gray-800 p-2 rounded-full transition-colors card-button"
                    disabled={isFlipping}
                    style={{ 
                        position: 'relative',
                        zIndex: 30
                    }}
                >
                    <EyeOff />
                </button>
            </div>
            <h4 className="text-5xl font-bold">***********</h4>
            <div className="flex flex-col items-end justify-center w-full">
                <p className="text-md font-semibold">************</p>
                <p className="text-sm text-[var(--foreground)]">**********</p>
            </div>
        </div>
    );
}