"use client";
import Link from "next/link";
import Icon from "./ui/Icon";
import { Sucursal } from "@/types/sucursal";
import { useModalStore } from "@/stores/useModalStore";
import { useRestaurantStore } from "@/stores/useRestaurantStore";
import Image from "next/image";

interface CardRestProps {
    restaurant: Sucursal;
    selected: boolean;
}

export default function CardRest({ restaurant, selected }: CardRestProps) {
    const { suc_id, suc_nom, suc_url_foto, neg_id } = restaurant;
    const typeModal = !selected ? "addRest" : "confirmDelete";
    const openModal = useModalStore((state) => state.openModal);
    const setIdRestaurantSelected = useRestaurantStore((state) => state.setIdRestaurantSelected);

    const handleIconClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (typeModal === "confirmDelete") return;
        event.preventDefault();
        event.stopPropagation();
        setIdRestaurantSelected(suc_id, neg_id);
        openModal(typeModal);
    };

    return (
        <Link
            href={`/restaurantes/${suc_id}/${neg_id}`}
            className="flex items-center gap-4 justify-between bg-[var(--violet-50)] rounded-lg px-5 py-6 w-full hover:scale-105 transition-all duration-300 ease-in-out hover:bg-[var(--violet-100)] mt-6"
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <Image
                    src={suc_url_foto}
                    alt="pizza"
                    className="w-30 h-20 object-contain flex-shrink-0 bg-white rounded-lg p-2 shadow-sm border border-gray-100"
                    width={200}
                    height={200}
                />
                <div className="flex flex-col items-start justify-center text-[var(--black)] min-w-0 flex-1">
                    <h4 className="font-bold text-lg truncate w-full">{suc_nom}</h4>
                    {/* <p className="text-sm text-gray-600 truncate w-full">{category}</p> */}
                </div>
            </div>

            <div className="flex-shrink-0">
                <Icon
                    name={selected ? "check" : "plus"}
                    iconColor={selected ? "var(--success)" : "white"}
                    backgroundColor={selected ? "var(--success-100)" : "var(--violet)"}
                    onClick={handleIconClick}
                />
            </div>
        </Link>
    );
}