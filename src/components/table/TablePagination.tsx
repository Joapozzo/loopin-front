import React from 'react';
import Button from '../ui/buttons/Button'; 
import { Select } from '../ui/inputs/Select'; 

interface TablePaginationProps {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
    pagination,
    onPageChange,
    onPageSizeChange
}) => {
    const { page, limit, total, totalPages } = pagination;

    const pageSizeOptions = [
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 20, label: '20' },
        { value: 50, label: '50' }
    ];

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    const goToPage = (newPage: number) => {
        if (onPageChange && newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onPageSizeChange) {
            onPageSizeChange(Number(e.target.value));
        }
    };

    // Generar números de página para mostrar
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Mostrar todas las páginas si son pocas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Lógica más compleja para muchas páginas
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between px-6 py-3 bg-white-100">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Mostrar</span>
                    <Select
                        options={pageSizeOptions}
                        value={limit}
                        onChange={handlePageSizeChange}
                        className="w-20"
                    />
                    <span className="text-sm text-gray-400">por página</span>
                </div>

                <div className="text-sm text-gray-400">
                    Mostrando {startItem} a {endItem} de {total} resultados
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                >
                    Anterior
                </Button>

                <div className="flex items-center space-x-1">
                    {getPageNumbers().map((pageNum, index) => (
                        <React.Fragment key={index}>
                            {pageNum === '...' ? (
                                <span className="px-2 py-1 text-gray-400">...</span>
                            ) : (
                                <Button
                                    variant={pageNum === page ? 'primary' : 'secondary'}
                                    size="sm"
                                    onClick={() => goToPage(pageNum as number)}
                                    className="min-w-[32px]"
                                >
                                    {pageNum}
                                </Button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
};
