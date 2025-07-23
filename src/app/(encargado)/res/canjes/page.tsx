import { CanjeTable } from "@/components/modules/CanjeTable";

export default function Page() {
    return (
        <CanjeTable
            // apiBaseURL={URI_API || '/api'}
            initialPageSize={15}
            // debounceMs={500}
        />
    )
}