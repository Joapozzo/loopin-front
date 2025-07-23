import { VentaTable } from "@/components/modules/VentaTable";
import { URI_API } from "@/data/utils";

export default function Page() {
    return (
        <VentaTable
            apiBaseURL={URI_API || '/api'}
            // initialPageSize={15}
            // debounceMs={500}
        />
    );
}