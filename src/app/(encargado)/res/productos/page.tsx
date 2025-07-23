import { ProductoTable } from "@/components/modules/ProductoTable"; 

export default function ProductosPage() {
    return (
        <ProductoTable
            initialPageSize={15}
        />
    );
}