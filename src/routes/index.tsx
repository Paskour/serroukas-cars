import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero3D } from "@/components/Hero3D";
import { BrandCarousel } from "@/components/BrandCarousel";
import { VehiclesSection } from "@/components/VehiclesSection";
import { AboutSection } from "@/components/AboutSection";
import { GallerySection } from "@/components/GallerySection";
import { AppointmentForm } from "@/components/AppointmentForm";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <main>
        <Hero3D />
        <BrandCarousel />
        <VehiclesSection />
        <AboutSection />
        <GallerySection />
        <AppointmentForm />
      </main>
      <Footer />
    </div>
  );
}
