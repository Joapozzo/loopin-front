// ProductsContainer.tsx
import { useProductStore } from "@/stores/productStore";
import Product from "./Product";
import { useTarjetaStore } from "@/stores/useTarjetaStore";
import { Product as ProductoType } from "@/types/product";
import { useSelectedRestaurant } from "@/hooks/useSelectedRestaurant";
import { useSearchStore } from "@/stores/useSearchStore";
import ProductsContainerSkeleton from "./skeletons/ProductsContainerSkeleton";

export default function ProductsContainer() {
    const searchTerm = useSearchStore((s) => s.searchTerm);
    const productos = useProductStore((s) => s.productos);
    const filteredProducts = useProductStore((s) => s.filteredProducts);
    const tarjetas = useTarjetaStore((s) => s.tarjetas);
    const restaurantSelected = useSelectedRestaurant();

    const isFiltering = !!restaurantSelected;

    const getPuntosForProduct = (product: ProductoType) => {
        const tarjeta = tarjetas?.find((t) => t.res_id === product.res_id);
        return tarjeta?.tar_puntos_disponibles || 0;
    };

    const matchesSearch = (product: ProductoType) =>
        product.pro_nom.toLowerCase().includes(searchTerm.toLowerCase());

    const renderProducts = () => {
        let productsToRender: ProductoType[] = [];

        if (isFiltering) {
            productsToRender = filteredProducts.length > 0 ? filteredProducts : productos;
        } else {
            productsToRender = productos;
        }

        const filteredBySearch = productsToRender.filter(matchesSearch);

        if (filteredBySearch.length === 0) {
            return (
                <p className="text-center w-full text-[var(--rose)]">
                    No se encontraron productos que coincidan con "{searchTerm}".
                </p>
            );
        }

        return filteredBySearch.map((p) => (
            <Product key={p.pro_id} product={p} puntos={getPuntosForProduct(p)} />
        ));
    };

    if (!productos || !tarjetas) {
        return <ProductsContainerSkeleton />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full">
            {renderProducts()}
        </div>
    );
}
