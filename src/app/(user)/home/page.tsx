"use client";
import CardCuponContainer from "@/components/CardCuponContainer";
import FilterCategory from "@/components/FilterCategory";
import Hero from "@/components/Hero";
import DesktopLayout from "@/components/layouts/LayoutContent";
import MobileLayout from "@/components/layouts/MobileLayout";
import CuponModal from "@/components/modals/CuponModal";
import OffMainContainer from "@/components/OffMainContainer";
import ProductsContainer from "@/components/ProductsContainer";
import Section from "@/components/Section";

export default function Page() {
  return (
    <>
      <Hero />
      <MobileLayout>
        <Section title="Tus cupones">
          <CardCuponContainer />
        </Section>

        <Section title="Ofertas para vos!">
          <OffMainContainer />
        </Section>

        <Section title="Encontra lo que estas buscando">
          <FilterCategory />
        </Section>

        <Section>
          <ProductsContainer />
        </Section>
      </MobileLayout>
      <CuponModal />
    </>
  );
}