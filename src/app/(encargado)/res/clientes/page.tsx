import { ClienteTable } from "@/components/ClienTable";
import { URI_API } from "@/data/utils";

export default function Page() {
    return (
        <ClienteTable
            apiBaseURL={URI_API || '/api'}
            initialPageSize={15}
            debounceMs={500}
        />
    )
}