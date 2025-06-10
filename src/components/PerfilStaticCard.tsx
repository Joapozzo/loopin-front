interface PerfilStaticCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
}

export default function PerfilStaticCard({ label, value, icon: Icon }: PerfilStaticCardProps) {
    return (
        <div className="flex items-center justify-between bg-[var(--gray-100)] p-4 rounded-lg cursor-not-allowed">
            <span className="p-3 text-[var(--white)] flex justify-center items-center rounded-full bg-[var(--gray-200)] text-md">
                <Icon />
            </span>
            <div className="flex flex-col items-center justify-start w-full ml-10">
                <h2 className="text-start w-full text-md font-medium text-[var(--gray-400)]">
                    {label}
                </h2>
                <p className="text-start w-full text-lg font-medium text-[var(--gray-300)] transition-colors duration-300">
                    {value}
                </p>
            </div>
        </div>
    )
}