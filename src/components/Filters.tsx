"use client";
import { Search } from "lucide-react";
import Icon from "./ui/Icon";
import Input from "./ui/inputs/Input";
import { useSearchStore } from "@/stores/useSearchStore";
import { useEffect } from "react";

export default function Filters() {
    const searchTerm = useSearchStore((state) => state.searchTerm);
    const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
    const clearSearchTerm = useSearchStore((state) => state.clearSearchTerm);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => { 
        if (searchTerm.length > 0) {
            clearSearchTerm();
        }
    }, []);

    return (
        <div className="flex items-center justify-between w-full gap-2">
            <Input
                name="buscar"
                placeholder="Busque un producto aquí"
                icon={<Search />}
                value={searchTerm}
                onChange={handleChange}
                allowOnlyLetters
            />
            <Icon name="down" colorVar="--rose" />
            <Icon name="funnel" />
        </div>
    );
}
