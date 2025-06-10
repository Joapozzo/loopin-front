import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/productStore";
import { Product } from "@/types/product";

export const useProductById = (id: number) => {
    const [product, setProduct] = useState<Product | null>(null);
    const products = useProductStore((s) => s.productos);

    useEffect(() => {
        if (id && products.length) {
            const found = products.find((p) => +p.pro_id === +id);
            setProduct(found ?? null);
        }
    }, [id, products]);

    return { product };
};
