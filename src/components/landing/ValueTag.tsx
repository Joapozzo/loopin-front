import React from 'react';

interface ValueTagProps {
    value: string;
}

const ValueTag: React.FC<ValueTagProps> = ({ value }) => {
    return (
        <div className="bg-[var(--violet-200)] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            {value}
        </div>
    );
};

export default ValueTag;