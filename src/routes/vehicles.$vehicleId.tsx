import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, ChevronRight, ChevronLeft, Maximize2, X } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getStoredVehicles, useVehiclesStore } from "@/lib/store";
import { useLang } from "@/lib/language";

import { getDefaultVehicleAttributes } from "@/lib/vehicles";

export const Route = createFileRoute("/vehicles/$vehicleId")({
  loader: ({ params }) => {
    const allVehicles = getStoredVehicles();
    const vehicle = allVehicles.find((item) => item.id === params.vehicleId);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  component: VehicleDetails,
});

function VehicleDetails() {
  const { tr } = useLang();
  const { vehicle: initialVehicle } = Route.useLoaderData();
  const [vehicles] = useVehiclesStore();
  const vehicle = vehicles.find((v) => v.id === initialVehicle.id) || initialVehicle;
  const photos = vehicle.images?.length ? vehicle.images : [vehicle.image];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const selectedPhoto = photos[selectedPhotoIndex] || photos[0];

  const handlePrevPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const specs = getDefaultVehicleAttributes(vehicle);

  return (
    <div className="min-h-dvh">
      <Navbar />
      <main className="pt-28 pb-20 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            to="/"
            hash="vehicles"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Πίσω στα οχήματα
          </Link>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.8fr)] lg:items-start">
            <section className="space-y-4">
              <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl glass-strong shadow-[var(--shadow-card)] bg-black/40">
                <img
                  src={selectedPhoto}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="h-full w-full object-contain transition-all duration-300 cursor-pointer"
                  onClick={() => handleOpenLightbox(selectedPhotoIndex)}
                />

                {/* Expand Button */}
                <button
                  onClick={() => handleOpenLightbox(selectedPhotoIndex)}
                  className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full glass-strong px-3.5 py-1.5 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Μεγέθυνση</span>
                </button>

                {/* Prev / Next Arrows on Main Image */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full glass-strong text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
                      aria-label="Προηγούμενη"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full glass-strong text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
                      aria-label="Επόμενη"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {photos.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {photos.slice(0, 4).map((photo, index) => {
                    const isLastSlot = index === 3 && photos.length > 4;
                    const remainingCount = photos.length - 3;
                    const isSelected = selectedPhotoIndex === index;

                    if (isLastSlot) {
                      return (
                        <button
                          key={photo + index}
                          onClick={() => handleOpenLightbox(3)}
                          className="group relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-transparent transition hover:scale-[1.02] focus:outline-none bg-black/40"
                          title={`Δες όλες τις ${photos.length} φωτογραφίες`}
                        >
                          <img
                            src={photo}
                            alt={`${vehicle.brand} ${vehicle.model} +${remainingCount}`}
                            className="h-full w-full object-contain brightness-50 group-hover:brightness-40 transition"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white font-bold group-hover:bg-black/60 transition">
                            <span className="font-mono text-xl sm:text-2xl">+{remainingCount}</span>
                            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider mt-0.5">Φωτογραφίες</span>
                          </div>
                        </button>
                      );
                    }

                    return (
                      <button
                        key={photo + index}
                        onClick={() => setSelectedPhotoIndex(index)}
                        className={`overflow-hidden rounded-2xl aspect-[4/3] border-2 transition bg-black/40 ${
                          isSelected
                            ? "border-primary scale-[1.02]"
                            : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`${vehicle.brand} ${vehicle.model} ${index + 1}`}
                          className="h-full w-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <aside className="lg:sticky lg:top-28 glass-strong rounded-3xl p-6 shadow-[var(--shadow-card)]">
              <div className="text-xs font-mono uppercase tracking-widest text-primary">{vehicle.brand}</div>
              <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">{vehicle.model}</h1>
              <div className="mt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground">Τιμή</div>
              <div className="mt-1 font-mono text-3xl sm:text-4xl font-bold text-gradient-red">
                {vehicle.price > 0 ? `€ ${vehicle.price.toLocaleString("el-GR")}` : tr("priceOnRequest")}
              </div>
              <a
                href={`/?vehicle=${vehicle.id}#book`}
                className="btn-hero btn-hero-hover mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-wider"
              >
                <CalendarDays className="h-4 w-4" /> Κλείσε ραντεβού για να το δεις από κοντά
                <ChevronRight className="h-4 w-4" />
              </a>
            </aside>
          </div>

          <section className="mt-14 max-w-4xl">
            <h2 className="font-display text-4xl">Χαρακτηριστικά</h2>
            <div className="mt-6 grid overflow-hidden rounded-3xl border border-white/10 sm:grid-cols-2">
              {specs.map((attr, index) => (
                <div key={index} className="flex items-center justify-between gap-5 border-b border-white/10 px-5 py-4 last:border-b-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-b-0 sm:[&:nth-child(odd)]:border-r">
                  <span className="text-sm text-muted-foreground">{attr.name}</span>
                  <span className="text-right text-sm font-semibold text-white">{attr.value}</span>
                </div>
              ))}
            </div>

            {vehicle.description && (
              <div className="mt-12">
                <h3 className="font-display text-2xl mb-4">Περιγραφή</h3>
                <div className="glass p-6 rounded-2xl text-muted-foreground leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="Κλείσιμο"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl">
            <img
              src={photos[lightboxIndex]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </div>

          {photos.length > 1 && (
            <>
              <button
                onClick={() => setLightboxIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25 transition"
                aria-label="Προηγούμενη"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setLightboxIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25 transition"
                aria-label="Επόμενη"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full glass-strong px-4 py-1.5 font-mono text-sm font-semibold text-white">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

