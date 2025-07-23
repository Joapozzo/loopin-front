import { ClienteTable } from "@/components/ClienTable";

export default function Page() {
    return (
        <ClienteTable
            // apiBaseURL={URI_API}
            initialPageSize={15}
            // debounceMs={500}
        />
    )
}