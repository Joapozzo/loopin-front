import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BenefitItemProps {
    icon: LucideIcon;
    title: string;
    description: string;
    gradientDirection?: 'normal' | 'reverse';
}

const BenefitItem: React.FC<BenefitItemProps> = ({
    icon: Icon,
    title,
    description,
    gradientDirection = 'normal'
}) => {
    const getGradientStyle = () => {
        return gradientDirection === 'reverse'
            ? { background: `linear-gradient(135deg, var(--rose) 0%, var(--violet) 100%)` }
            : { background: `linear-gradient(135deg, var(--violet) 0%, var(--rose) 100%)` };
    };

    return (
        <div className="flex items-start space-x-6 group">
            {/* Icon container */}
            <div
                className="w-15 h-15 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={getGradientStyle()}
            >
                <Icon className="text-white" size={28} />
            </div>

            {/* Content */}
            <div className="flex-1">
                <h4 className="text-xl font-bold text-[var(--foreground)] mb-3">
                    {title}
                </h4>
                <p className="text-[var(--black)] leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

export default BenefitItem;