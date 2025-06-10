import React from 'react';
import Input from '../ui/inputs/Input';
import Button from '../ui/buttons/Button';
import { Search } from 'lucide-react';

interface TableFiltersProps {
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    onRefresh?: () => void;
    children?: React.ReactNode;
    placeHolder?: string;
}

export const TableFilters: React.FC<TableFiltersProps> = ({
    searchValue = "",
    onSearchChange,
    onRefresh,
    children,
    placeHolder = "Buscar...",
}) => {
    return (
        <div className="bg-white p-4 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    {onSearchChange && (
                        <div className="w-64">
                            <Input
                                icon={<Search size={16} />}
                                placeholder={placeHolder}
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    )}

                    {children}
                </div>

                <div className="flex items-center gap-2">
                    {onRefresh && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            className="flex items-center"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Actualizar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};