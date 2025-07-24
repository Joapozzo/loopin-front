"use client";
import { useWelcomeMessage } from "@/hooks/useWelcomeMessage";
import CardCuponContainer from "@/components/CardCuponContainer";
import FilterCategory from "@/components/FilterCategory";
import Hero from "@/components/Hero";
import MobileLayout from "@/components/layouts/MobileLayout";
import CuponModal from "@/components/modals/CuponModal";
import OffMainContainer from "@/components/OffMainContainer";
import ProductsContainer from "@/components/ProductsContainer";
import Section from "@/components/Section";
import CodigoPromocionalModal from "@/components/modals/CodigoPromocionalModal";
import { useRestauranteSeleccionadoStore } from "@/stores/useRestaurantSeleccionado";
import CuponPuntosComponent from "@/components/CuponPuntosComponent";

export default function Page() {
  useWelcomeMessage();

  const restauranteSeleccionado = useRestauranteSeleccionadoStore((state) => state.restauranteSeleccionado);

  const neg_id = restauranteSeleccionado?.neg_id || 1;
  const suc_id = restauranteSeleccionado?.suc_id || 1;

  return (
    <>
      <Hero />
      <MobileLayout>
        <Section title="Tus cupones">
          <CardCuponContainer />
        </Section>
        <Section title="Ofertas para vos!">
          {/* 🔄 Usar IDs dinámicos */}
          <OffMainContainer neg_id={neg_id} suc_id={suc_id} />
        </Section>
        <Section title="Encontra lo que estas buscando" id="filter-category-section">
          <FilterCategory />
        </Section>
        <Section>
          <ProductsContainer />
        </Section>
        <CuponPuntosComponent/>
      </MobileLayout>
    </>
  );
}