import React from 'react';

interface SectionProps {
    id?: string;
    badge?: string;
    title?: string;
    titleHighlight?: string;
    children: React.ReactNode;
    variant?: 'transparent' | 'gradient' | 'dark' | 'light';
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Section: React.FC<SectionProps> = ({
    id,
    badge,
    title,
    titleHighlight,
    children,
    variant = 'transparent',
    className = '',
    padding = 'lg'
}) => {
    const getBackgroundClasses = () => {
        switch (variant) {
            case 'gradient':
                return 'bg-gradient-to-br from-[var(--violet-50)] via-[var(--background)] to-[var(--rose-50)]';
            case 'dark':
                return 'bg-[var(--black)]';
            case 'light':
                return 'bg-[var(--background)]';
            case 'transparent':
            default:
                return 'bg-transparent';
        }
    };

    const getPaddingClasses = () => {
        switch (padding) {
            case 'none':
                return '';
            case 'sm':
                return 'py-8 sm:py-12 md:py-16';
            case 'md':
                return 'pt-20 sm:pt-24 md:pt-28 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24';
            case 'lg':
                return 'py-16 sm:py-20 md:py-24 lg:py-32';
            case 'xl':
                return 'py-20 sm:py-24 md:py-32 lg:py-40';
            default:
                return 'py-16 sm:py-20 md:py-24 lg:py-32';
        }
    };

    const getContainerPadding = () => {
        // Padding horizontal responsive para el contenedor interno
        return 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16';
    };

    const getTitleClasses = () => {
        const baseClasses = 'font-bold mb-4 sm:mb-4 md:mb-6 lg:mb-6 leading-tight text-center';

        if (variant === 'dark') {
            return `${baseClasses} text-white`;
        }

        return `${baseClasses} text-[var(--foreground)]`;
    };

    return (
        <section
            id={id}
            className={`
                relative 
                z-10
                px-4 sm:px-6 md:px-8 lg:px-0 text-left
                ${getBackgroundClasses()} 
                ${getPaddingClasses()} 
                ${className}
            `}
        >
            <div className={`max-w-7xl mx-auto ${getContainerPadding()}`}>
                <div className="text-start
                            sm:text-start md:text-center lg:text-center xl:text-center">
                    {badge && (
                        <div className="inline-block bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-4">
                            {badge}
                        </div>
                    )}

                    {(title || titleHighlight) && (
                        <h2 className={`
                            text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-start
                            sm:text-start md:text-center lg:text-center xl:text-center
                            ${getTitleClasses()}
                        `}>
                            {title}
                            {titleHighlight && (
                                <>
                                    <br />
                                    <span className="bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] bg-clip-text text-transparent">
                                        {titleHighlight}
                                    </span>
                                </>
                            )}
                        </h2>
                    )}
                </div>
                {children}
            </div>
        </section>
    );
};

export default Section;