import { MoveUpRight } from "lucide-react";
import Link from "next/link";

interface PerfilItemCardProps {
    text: string;
    icon: React.ElementType;
    url: string;
}


export default function PerfilItemCard({ text, icon: Icon, url }: PerfilItemCardProps) {
    return (
        <Link className="flex items-center justify-between bg-[var(--violet-100)] p-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-[var(--violet-200)] hover:shadow-xl hover:-translate-y-1 group" href={url}>
            <span className="p-3 text-[var(--white)] flex justify-center items-center rounded-full bg-[var(--violet)] text-md transition-colors duration-300 group-hover:bg-[var(--violet-800)]">
                <Icon />
            </span>
            <h2 className="text-lg font-medium text-[var(--violet)] text-start w-full ml-10 transition-colors duration-300 group-hover:text-[var(--violet-900)]">
                {text}
            </h2>
            <span className="text-[var(--violet)] transition-transform duration-300 group-hover:rotate-12">
                <MoveUpRight />
            </span>
        </Link>
    );
}
