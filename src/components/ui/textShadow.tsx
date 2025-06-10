export default function TextShadow({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[var(--violet-100)] text-[var(--white)] rounded-lg px-4 py-1 text-sm w-max">
            {children}
        </div>
    )
}