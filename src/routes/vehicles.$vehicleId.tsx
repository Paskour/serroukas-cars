import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, ChevronRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { vehicles } from "@/lib/vehicles";

export const Route = createFileRoute("/vehicles/$vehicleId")({
  loader: ({ params }) => {
    const vehicle = vehicles.find((item) => item.id === params.vehicleId);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  component: VehicleDetails,
});

function VehicleDetails() {
  const { vehicle } = Route.useLoaderData();
  const photos = vehicle.images?.length ? vehicle.images : [vehicle.image];
  const [selectedPhoto, setSelectedPhoto] = useState(photos[0]);

  const specs = [
    ["Κωδικός", vehicle.code || vehicle.id],
    ["Χιλιόμετρα", vehicle.km ? `${vehicle.km.toLocaleString("el-GR")} km` : null],
    ["Κυβικά", vehicle.cc ? `${vehicle.cc.toLocaleString("el-GR")} cc` : null],
    ["Χρονολογία", vehicle.year],
    ["Ίπποι", vehicle.horsepower ? `${vehicle.horsepower} hp` : null],
    ["Καύσιμο", vehicle.fuel],
    ["Σασμάν", vehicle.transmission],
    ["Κίνηση", vehicle.drive],
    ["Πόρτες", vehicle.doors],
    ["Καθίσματα", vehicle.seats],
    ["Χρώμα εσωτερικό", vehicle.interiorColor],
    ["Ρύποι", vehicle.emissions],
  ].filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== 0);

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
              <div className="overflow-hidden rounded-3xl glass-strong shadow-[var(--shadow-card)] aspect-[4/3]">
                <img
                  src={selectedPhoto}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="h-full w-full object-cover transition-all duration-300"
                />
              </div>
              {photos.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {photos.map((photo, index) => (
                    <button
                      key={photo + index}
                      onClick={() => setSelectedPhoto(photo)}
                      className={`overflow-hidden rounded-2xl aspect-[4/3] border-2 transition ${
                        selectedPhoto === photo ? "border-primary scale-[1.02]" : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`${vehicle.brand} ${vehicle.model} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            <aside className="lg:sticky lg:top-28 glass-strong rounded-3xl p-6 shadow-[var(--shadow-card)]">
              <div className="text-xs font-mono uppercase tracking-widest text-primary">{vehicle.brand}</div>
              <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">{vehicle.model}</h1>
              <div className="mt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground">Τιμή</div>
              <div className="mt-1 font-mono text-3xl sm:text-4xl font-bold text-gradient-red">
                {vehicle.price > 0 ? `€ ${vehicle.price.toLocaleString("el-GR")}` : "Κατόπιν Επικοινωνίας"}
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
              {specs.map(([label, value]) => (
                <div key={String(label)} className="flex items-center justify-between gap-5 border-b border-white/10 px-5 py-4 last:border-b-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-b-0 sm:[&:nth-child(odd)]:border-r">
                  <span className="text-sm text-muted-foreground">{String(label)}</span>
                  <span className="text-right text-sm font-semibold">{String(value)}</span>
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
      <Footer />
    </div>
  );
}

