import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    ColumnDef,
    flexRender,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
} from '@tanstack/react-table';
import { TablePagination } from './TablePagination';
import { cn } from '@/utils/utils';
import ErrorMessage from '../ui/ErrorMessage';

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    loading?: boolean;
    error?: string | null;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    sorting?: { sortBy?: string; sortOrder?: 'asc' | 'desc' };
    onSortingChange?: (sorting: { sortBy?: string; sortOrder?: 'asc' | 'desc' }) => void;
    className?: string;
    emptyMessage?: string;
}

export function DataTable<TData>({
    columns,
    data,
    loading = false,
    error = null,
    pagination,
    onPageChange,
    onPageSizeChange,
    sorting,
    onSortingChange,
    className,
    emptyMessage = 'No hay datos disponibles'
}: DataTableProps<TData>) {
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    // Convertir sorting a formato TanStack Table
    const [sortingState, setSortingState] = React.useState<SortingState>(() => {
        if (sorting?.sortBy) {
            return [{
                id: sorting.sortBy,
                desc: sorting.sortOrder === 'desc'
            }];
        }
        return [];
    });

    // Sincronizar sorting state con prop
    React.useEffect(() => {
        if (onSortingChange && sortingState.length > 0) {
            const sort = sortingState[0];
            onSortingChange({
                sortBy: sort.id,
                sortOrder: sort.desc ? 'desc' : 'asc'
            });
        } else if (onSortingChange && sortingState.length === 0) {
            onSortingChange({});
        }
    }, [sortingState, onSortingChange]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSortingState,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting: sortingState,
            columnFilters,
            columnVisibility,
        },
        manualPagination: !!pagination,
        manualSorting: !!onSortingChange,
    });

    if (error) {
        return (
            <ErrorMessage error={error} />
        );
    }

    return (
        <div className={cn("bg-white rounded-lg border border-gray-200 overflow-hidden", className)}>
            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={cn(
                                                    "flex items-center space-x-1",
                                                    header.column.getCanSort() && "cursor-pointer select-none hover:text-foreground"
                                                )}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <span>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </span>
                                                {header.column.getCanSort() && (
                                                    <span className="flex flex-col">
                                                        <svg
                                                            className={cn(
                                                                "w-3 h-3 -mb-1",
                                                                header.column.getIsSorted() === 'asc' ? 'text-violet' : 'text-gray-300'
                                                            )}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg
                                                            className={cn(
                                                                "w-3 h-3 -mt-1",
                                                                header.column.getIsSorted() === 'desc' ? 'text-violet' : 'text-gray-300'
                                                            )}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet"></div>
                                        <span className="ml-2 text-sm text-gray-400">Cargando...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="text-gray-600">
                                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {pagination && (
                <div className="border-t border-gray-200 bg-white-100">
                    <TablePagination
                        pagination={pagination}
                        onPageChange={onPageChange}
                        onPageSizeChange={onPageSizeChange}
                    />
                </div>
            )}
        </div>
    );
}