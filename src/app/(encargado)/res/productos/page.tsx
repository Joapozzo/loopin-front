import { ProductoTable } from "@/components/modules/ProductoTable"; 
import { URI_API } from "@/data/utils";

export default function ProductosPage() {
    return (
        <ProductoTable
            apiBaseURL={URI_API || '/api'}
            initialPageSize={15}
            debounceMs={500}
        />
    );
}