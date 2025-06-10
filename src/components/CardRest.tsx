"use client";
import Link from "next/link";
import Icon from "./ui/Icon";
import { Restaurant } from "@/types/restaurant";
import { useModalStore } from "@/stores/useModalStore";
import { useRestaurantStore } from "@/stores/restaurantStore";

interface CardRestProps {
    restaurant: Restaurant;
    selected: boolean;
}

export default function CardRest({ restaurant, selected }: CardRestProps) {
    const { res_id, res_nom, res_url_foto, category } = restaurant;
    const typeModal = !selected ? "addRest" : "confirmDelete";
    const openModal = useModalStore((state) => state.openModal);
    const setIdRestaurantDelete = useRestaurantStore((state) => state.setIdRestaurantDelete);

    const handleIconClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        setIdRestaurantDelete(res_id);
        openModal(typeModal);
    };

    return (
        <Link
            href={"restaurantes/" + res_id}
            className="flex items-center gap-4 justify-between bg-[var(--violet-50)] rounded-lg px-5 py-6 w-full hover:scale-105 transition-all duration-300 ease-in-out hover:bg-[var(--violet-100)]"
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <img
                    src={res_url_foto}
                    alt="pizza"
                    className="w-16 h-16 object-contain flex-shrink-0"
                />
                <div className="flex flex-col items-start justify-center text-[var(--black)] min-w-0 flex-1">
                    <h4 className="font-bold text-lg truncate w-full">{res_nom}</h4>
                    <p className="text-sm text-gray-600 truncate w-full">{category}</p>
                </div>
            </div>
            
            <div className="flex-shrink-0">
                <Icon
                    name={selected ? "check" : "plus"}
                    colorVar={selected ? "--success" : "--violet-200"}
                    onClick={handleIconClick}
                />
            </div>
        </Link>
    );
}