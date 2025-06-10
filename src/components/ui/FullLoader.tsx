import SpinnerLoader from "./SpinerLoader";

export default function FullLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <SpinnerLoader color="text-[var(--violet)]" size="h-10 w-10" />
        </div>
    );
}