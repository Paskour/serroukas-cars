import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { VehicleCard } from "./VehicleCard";
import { vehicles, brands, type VehicleType } from "@/lib/vehicles";
import { useLang } from "@/lib/language";

const TYPES: { key: VehicleType | "all"; labelKey: any }[] = [
  { key: "all", labelKey: "all" },
  { key: "passenger", labelKey: "typePassenger" },
  { key: "commercial", labelKey: "typeCommercial" },
  { key: "truck", labelKey: "typeTruck" },
  { key: "machine", labelKey: "typeMachine" },
];

export function VehiclesSection() {
  const { tr } = useLang();
  const [type, setType] = useState<VehicleType | "all">("all");
  const [brand, setBrand] = useState<string>("all");

  const filtered = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          (type === "all" || v.type === type) && (brand === "all" || v.brand === brand),
      ),
    [type, brand],
  );

  return (
    <section id="vehicles" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        >
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-primary">
              // {tr("featuredTitle")}
            </div>
            <h2 className="mt-3 font-display text-5xl sm:text-6xl leading-none">
              {tr("featuredTitle")}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">{tr("featuredSub")}</p>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="glass-strong rounded-2xl p-4 mb-10 flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => setType(t.key)}
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
          <div className="ml-auto flex items-center gap-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {tr("brand")}
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="glass rounded-full px-4 py-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all" className="bg-background">
                {tr("all")}
              </option>
              {brands.map((b) => (
                <option key={b.name} value={b.name} className="bg-background">
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <VehicleCard key={v.id} v={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
