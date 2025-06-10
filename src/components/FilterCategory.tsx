import ButtonFilterCategory from "./ui/buttons/buttonFilterCategory";
import Filters from "./Filters";

export default function FilterCategory() {
    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between w-full">
                <ButtonFilterCategory icon="🍕" />
                <ButtonFilterCategory icon="🍔" />
                <ButtonFilterCategory icon="🍟" />
                <ButtonFilterCategory icon="🍝" />
                <ButtonFilterCategory icon="🥘" />
            </div>
            <Filters />
        </div>
    );
}