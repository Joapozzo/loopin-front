import ButtonFilterCategory from "./ui/buttons/buttonFilterCategory";
import Filters from "./Filters";
import { useCategorias } from "@/hooks/useCategoria";
import { useSearchStore } from "@/stores/useSearchStore";
import { CategoriaProducto } from "@/types/CategoriaProducto";

// Mapeo de iconos basado en nombres de categorías
const getCategoryIcon = (categoryName: string): string => {
    const name = categoryName.toLowerCase();

    // Mapeo de palabras clave a iconos
    const iconMap: Record<string, string> = {
        // Comidas principales
        'pizza': '🍕',
        'pizzas': '🍕',
        'burger': '🍔',
        'hamburguesa': '🍔',
        'hamburguesas': '🍔',
        'papa': '🍟',
        'papas': '🍟',
        'fritas': '🍟',
        'pasta': '🍝',
        'pastas': '🍝',
        'fideos': '🍝',
        'parrilla': '🥩',
        'carne': '🥩',
        'asado': '🥩',
        'empanada': '🥟',
        'empanadas': '🥟',
        'almuerzo': '🍔',
        'cena': '🍝',
        'merienda': '🍰',

        // Bebidas
        'bebida': '🥤',
        'bebidas': '🥤',
        'cerveza': '🍺',
        'cervezas': '🍺',
        'vino': '🍷',
        'vinos': '🍷',
        'cafe': '☕',
        'café': '☕',
        'jugo': '🧃',
        'jugos': '🧃',
        'agua': '💧',
        'gaseosa': '🥤',
        'gaseosas': '🥤',

        // Postres
        'postre': '🍰',
        'postres': '🍰',
        'helado': '🍦',
        'helados': '🍦',
        'torta': '🎂',
        'tortas': '🎂',
        'dulce': '🍬',
        'dulces': '🍬',

        // Comida rápida
        'sandwich': '🥪',
        'sandwiches': '🥪',
        'hot dog': '🌭',
        'pancho': '🌭',
        'taco': '🌮',
        'tacos': '🌮',

        // Saludable
        'ensalada': '🥗',
        'ensaladas': '🥗',
        'vegano': '🥬',
        'vegetariano': '🥬',
        'saludable': '🥗',

        // Desayuno
        'desayuno': '🥐',
        'medialunas': '🥐',
        'tostada': '🍞',
        'tostadas': '🍞',

        // Otros
        'sushi': '🍣',
        'china': '🥡',
        'japonesa': '🍱',
        'mexicana': '🌮',
        'italiana': '🍝',
        'americana': '🍔',
    };

    // Buscar coincidencias en el nombre
    for (const [key, icon] of Object.entries(iconMap)) {
        if (name.includes(key)) {
            return icon;
        }
    }

    // Icono por defecto
    return '🍽️';
};

// Convertir categorías reales al formato esperado
const formatCategories = (categorias: CategoriaProducto[]) => {
    return categorias.map(categoria => ({
        id: categoria.cat_tip_id,
        icon: getCategoryIcon(categoria.cat_tip_nom),
        label: categoria.cat_tip_nom,
        description: categoria.cat_tip_desc
    }));
};

export default function FilterCategory() {
    const { categorias, isLoading, error } = useCategorias();
    const selectedCategoryId = useSearchStore((s) => s.selectedCategoryId);
    const setSelectedCategory = useSearchStore((s) => s.setSelectedCategory);

    // Función para manejar click en categoría
    const handleCategoryClick = (categoryId: number | null) => {
        // Si ya está seleccionada, deseleccionar (mostrar todas)
        if (selectedCategoryId === categoryId) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(categoryId);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-4">
                {/* Skeleton Mobile */}
                <div className="flex items-center justify-between w-full sm:hidden">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <div
                            key={index}
                            className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"
                        />
                    ))}
                </div>

                <div className="hidden sm:flex items-center gap-3 w-full flex-wrap p-1">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <div
                            key={index}
                            className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
                        />
                    ))}
                </div>

                <Filters />
            </div>
        );
    }

    if (error) {
        console.error('Error loading categories:', error);
        const defaultCategories = [
            { id: 1, icon: "🍽️", label: "Todas", description: null },
        ];

        return (
            <div className="w-full flex flex-col gap-4">
                <div className="flex items-center justify-between w-full sm:hidden">
                    {defaultCategories.map((category) => (
                        <ButtonFilterCategory
                            key={category.id}
                            icon={category.icon}
                            variant="mobile"
                        />
                    ))}
                </div>

                <div className="hidden sm:flex items-center gap-3 w-full flex-wrap p-1">
                    {defaultCategories.map((category) => (
                        <ButtonFilterCategory
                            key={category.id}
                            icon={category.icon}
                            label={category.label}
                            variant="desktop"
                        />
                    ))}
                </div>

                <Filters />
            </div>
        );
    }

    const formattedCategories = formatCategories(categorias);

    const allCategories = [
        { id: null, icon: "🍽️", label: "Todas", description: "Todos los productos" },
        ...formattedCategories
    ];

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Vista Mobile - Botones cuadrados */}
            <div className="flex items-center justify-between w-full sm:hidden">
                {allCategories.slice(0, 5).map((category) => (
                    <ButtonFilterCategory
                        key={category.id || 'todas'}
                        icon={category.icon}
                        variant="mobile"
                        isActive={selectedCategoryId === category.id}
                        onClick={() => handleCategoryClick(category.id)}
                    />
                ))}
            </div>

            {/* Vista Desktop - Chips horizontales */}
            <div className="hidden sm:flex items-center gap-3 w-full flex-wrap p-1">
                {allCategories.map((category) => (
                    <ButtonFilterCategory
                        key={category.id || 'todas'}
                        icon={category.icon}
                        label={category.label}
                        variant="desktop"
                        isActive={selectedCategoryId === category.id}
                        onClick={() => handleCategoryClick(category.id)}
                    />
                ))}
            </div>

            <Filters />
        </div>
    );
}