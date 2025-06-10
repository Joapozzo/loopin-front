interface ErrorMessageProps {
    error: string;
}

export const ErrorMessage = ({  error }: ErrorMessageProps) => {
    return (
        <div className="flex items-center justify-center h-32 bg-white rounded-lg border border-gray-200">
            <div className="text-center">
                <div className="text-[var(--error)] mb-2">
                    <svg
                        className="w-8 h-8 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <p className="text-sm text-[var(--error)] font-medium">
                    Error al cargar datos
                </p>
                <p className="text-xs text-[var(--error-400)] mt-1">{error}</p>
            </div>
        </div>
    )
}

export default ErrorMessage;