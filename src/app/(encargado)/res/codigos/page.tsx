import { CuponTable } from "@/components/modules/CuponTable";

export default function Page() {

    return (
        <CuponTable
            // apiBaseURL={URI_API || '/api'}
            initialPageSize={15}
            encargadoId={1}
            // debounceMs={500}
        />
    )
}