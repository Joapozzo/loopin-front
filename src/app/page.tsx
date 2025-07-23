"use client";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import About from "../components/landing/About";
import Beneficios from "../components/landing/Beneficios";
import AboutUs from "../components/landing/AboutUs";
import CallToAction from "../components/landing/CallToAction";
import Footer from "../components/landing/Footer";
import Animated from "../components/landing/Animated";
import MainLayout from "../components/landing/MainLayout";
import Modal from "../components/landing/Modal";
import { useModal } from "../components/landing/hooks/useModal";

export default function Home() {

  const { isOpen, openModal, closeModal } = useModal();

  return (
    <MainLayout>
      <Animated />
      <Navbar onContactClick={openModal} />
      <Hero onContactClick={openModal}/>
      <About />
      <Beneficios />
      <AboutUs />
      <CallToAction onContactClick={openModal}/>
      <Footer />
      <Modal isOpen={isOpen} closeModal={closeModal} />
    </MainLayout>
  );
}