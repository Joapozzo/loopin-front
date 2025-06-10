"use client";
import CardRest from "@/components/CardRest";
import HeroRest from "@/components/HeroRest";
import DesktopLayout from "@/components/layouts/LayoutContent";
import MobileLayout from "@/components/layouts/MobileLayout";
import ModalConfirmation from "@/components/modals/ModalConfirmation";
import ModalAgregarRestBody from "@/components/modals/templates/BodyAgregarRestaurante";
import ModalConfirmationBody from "@/components/modals/templates/BodyEliminarRestaurante";
import Section from "@/components/Section";
import { useRestaurantUser } from "@/hooks/useRestaurantUser";
import { useSearchStore } from "@/stores/useSearchStore";
import { useModalStore } from "@/stores/useModalStore";
import { Restaurant } from "@/types/restaurant";

export default function Page() {
    const { restaurants, restaurantesUser, loading, error } = useRestaurantUser();

    const searchTerm = useSearchStore((s) => s.searchTerm);
    const modalType = useModalStore((s) => s.modalType);

    const matchesSearch = (restaurant: Restaurant) =>
        restaurant.res_nom.toLowerCase().includes(searchTerm.toLowerCase());

    const filteredRestaurantes = restaurants.filter(matchesSearch);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    const adheridosSet = new Set(restaurantesUser.map((r) => r.res_id));

    return (
        <DesktopLayout>
            {/* HeroRest full width */}
            <HeroRest title="Restaurantes disponibles" />

            {/* Contenido con padding solo en móvil */}
            <MobileLayout>
                <Section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full">
                        {filteredRestaurantes.map((rest) => (
                            <CardRest
                                key={rest.res_id}
                                restaurant={rest}
                                selected={adheridosSet.has(rest.res_id)}
                            />
                        ))}
                    </div>
                </Section>
            </MobileLayout>

            {/* Modal global fuera del layout */}
            <ModalConfirmation>
                {(handleClose) => {
                    if (modalType === "confirmDelete") {
                        return <ModalConfirmationBody handleClose={handleClose} />;
                    }
                    if (modalType === "addRest") {
                        return <ModalAgregarRestBody handleClose={handleClose} />;
                    }
                    return null;
                }}
            </ModalConfirmation>
        </DesktopLayout>
    );
}