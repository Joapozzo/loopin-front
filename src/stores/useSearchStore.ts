import { create } from "zustand";

type SortOrder = 'none' | 'asc' | 'desc';

interface SearchState {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    clearSearchTerm: () => void;
    selectedCategoryId: number | null;
    setSelectedCategory: (categoryId: number | null) => void;
    clearFilters: () => void;
    
    pointsSortOrder: SortOrder;
    togglePointsSort: () => void;
    clearPointsSort: () => void;
    
    showAdvancedFilters: boolean;
    toggleAdvancedFilters: () => void;
    
    // ✅ NUEVO: Orden alfabético
    alphabeticalOrder: SortOrder;
    toggleAlphabeticalOrder: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
    searchTerm: '',
    selectedCategoryId: null,
    pointsSortOrder: 'none',
    showAdvancedFilters: false,
    alphabeticalOrder: 'none', // ✅ NUEVO

    setSearchTerm: (term: string) =>
        set({ searchTerm: term }),

    clearSearchTerm: () =>
        set({ searchTerm: '' }),

    setSelectedCategory: (categoryId: number | null) =>
        set({ selectedCategoryId: categoryId }),

    clearFilters: () =>
        set({ 
            searchTerm: '', 
            selectedCategoryId: null,
            pointsSortOrder: 'none',
            showAdvancedFilters: false,
            alphabeticalOrder: 'none' // ✅ AGREGADO AL CLEAR
        }),

    togglePointsSort: () => {
        const currentOrder = get().pointsSortOrder;
        let newOrder: SortOrder = 'asc';
        
        if (currentOrder === 'asc') {
            newOrder = 'desc';
        } else if (currentOrder === 'desc') {
            newOrder = 'none';
        }
        
        set({ pointsSortOrder: newOrder });
    },

    clearPointsSort: () =>
        set({ pointsSortOrder: 'none' }),

    toggleAdvancedFilters: () =>
        set({ showAdvancedFilters: !get().showAdvancedFilters }),

    // ✅ NUEVO: Función para orden alfabético
    toggleAlphabeticalOrder: () => {
        const currentOrder = get().alphabeticalOrder;
        let newOrder: SortOrder = 'asc';
        
        if (currentOrder === 'asc') {
            newOrder = 'desc';
        } else if (currentOrder === 'desc') {
            newOrder = 'none';
        }
        
        set({ alphabeticalOrder: newOrder });
    },
}));