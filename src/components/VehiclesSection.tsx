import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Layers, Sparkles } from "lucide-react";
import { VehicleCard } from "./VehicleCard";
import { type VehicleType } from "@/lib/vehicles";
import { useLang } from "@/lib/language";
import { useVehiclesStore, useBrandsStore } from "@/lib/store";

const TYPES: { key: VehicleType | "all"; labelKey: any }[] = [
  { key: "all", labelKey: "all" },
  { key: "passenger", labelKey: "typePassenger" },
  { key: "commercial", labelKey: "typeCommercial" },
  { key: "truck", labelKey: "typeTruck" },
  { key: "machine", labelKey: "typeMachine" },
];

const INITIAL_BATCH_SIZE = 6;
const BATCH_INCREMENT = 6;

export function VehiclesSection() {
  const { tr } = useLang();
  const [vehicles] = useVehiclesStore();
  const { brands: availableBrands } = useBrandsStore();
  const [type, setType] = useState<VehicleType | "all">("all");
  const [brand, setBrand] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);

  // Filter vehicles
  const filtered = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          (type === "all" || v.type === type) &&
          (brand === "all" || v.brand.toLowerCase() === brand.toLowerCase())
      ),
    [vehicles, type, brand]
  );

  // Reset section count when filters change to preserve initial fast load time
  const handleTypeChange = (newType: VehicleType | "all") => {
    setType(newType);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + BATCH_INCREMENT, filtered.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_BATCH_SIZE);
    // Smooth scroll back to vehicles section top
    document.getElementById("vehicles")?.scrollIntoView({ behavior: "smooth" });
  };

  const displayedVehicles = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const hasMore = visibleCount < filtered.length;

  return (
    <section id="vehicles" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        >
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-primary flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              {tr("featuredTitle")}
            </div>
            <h2 className="mt-3 font-display text-5xl sm:text-6xl leading-none">
              {tr("featuredTitle")}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">{tr("featuredSub")}</p>
          </div>

          {/* Sectioning Status Indicator */}
          <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-2.5 self-start sm:self-auto text-xs font-mono">
            <Layers className="w-4 h-4 text-primary shrink-0" />
            <span className="text-muted-foreground">
              {tr("showingVehicles")} <strong className="text-foreground">{displayedVehicles.length}</strong> {tr("ofTotal")} <strong className="text-foreground">{filtered.length}</strong> {tr("vehiclesCount")}
            </span>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="glass-strong rounded-2xl p-4 mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => handleTypeChange(t.key)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  type === t.key
                    ? "btn-hero"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {tr(t.labelKey)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {tr("brand")}
            </label>
            <select
              value={brand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="glass rounded-full px-4 py-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all" className="bg-background">
                {tr("all")}
              </option>
              {availableBrands.map((b) => (
                <option key={b} value={b} className="bg-background">
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vehicles Grid */}
        {filtered.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center my-12">
            <p className="text-muted-foreground text-base">{tr("noVehicles")}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {displayedVehicles.map((v) => (
                <VehicleCard key={v.id} v={v} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Sectioning Controls / Load More Bar */}
        {filtered.length > INITIAL_BATCH_SIZE && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-14 flex flex-col items-center justify-center gap-4"
          >
            {/* Progress indicator bar */}
            <div className="w-full max-w-xs bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 rounded-full"
                style={{ width: `${(displayedVehicles.length / filtered.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-3">
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  className="btn-hero btn-hero-hover rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <span>{tr("loadMore")}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {visibleCount > INITIAL_BATCH_SIZE && (
                <button
                  onClick={handleShowLess}
                  className="glass hover:bg-white/10 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground flex items-center gap-2 transition"
                >
                  <span>{tr("showLess")}</span>
                  <ChevronUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
