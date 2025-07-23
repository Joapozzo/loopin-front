import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardAboutProps {
    icon: LucideIcon;
    title: string;
    description: string;
    gradientDirection?: 'normal' | 'reverse';
}

const CardAbout: React.FC<CardAboutProps> = ({ 
    icon: Icon, 
    title, 
    description, 
    gradientDirection = 'normal' 
}) => {
    const getGradientClasses = () => {
        return gradientDirection === 'reverse'
            ? 'from-[var(--rose)] to-[var(--violet)]'
            : 'from-[var(--violet)] to-[var(--rose)]';
    };

    return (
        <div className="relative"> {/* Altura responsive */}
            {/* Blur effect background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${getGradientClasses()} rounded-2xl sm:rounded-3xl blur opacity-25 group-hover:opacity-75 transition-opacity duration-500`}></div>
            
            {/* Card content */}
            <div className="relative bg-[var(--background)] border-[var(--violet-50)] p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 md:hover:-translate-y-4 border h-full flex flex-col">
                {/* Icon - Responsive sizing */}
                <div className={`w-12 h-12 sm:w-12 sm:h-12 md:w-15 md:h-15 bg-gradient-to-r ${getGradientClasses()} rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7" />
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--foreground)] mb-2 sm:mb-3 md:mb-4">
                        {title}
                    </h3>
                    <p className="text-sm sm:text-base text-[var(--black)] leading-relaxed flex-1">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CardAbout;