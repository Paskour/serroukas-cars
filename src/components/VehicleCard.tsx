import { useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import type { Vehicle } from "@/lib/vehicles";
import { useLang } from "@/lib/language";

export function VehicleCard({ v }: { v: Vehicle }) {
  const { tr } = useLang();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={() => navigate({ to: "/vehicles/$vehicleId", params: { vehicleId: v.id } })}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate({ to: "/vehicles/$vehicleId", params: { vehicleId: v.id } });
          }
        }}
        role="link"
        tabIndex={0}
        className="tilt-card group relative cursor-pointer overflow-hidden rounded-3xl glass-strong shadow-[var(--shadow-card)] focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={v.image}
            alt={`${v.brand} ${v.model}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          {v.badge && (
            <span className="absolute top-3 left-3 rounded-full btn-hero px-3 py-1 text-[10px] font-mono tracking-widest">
              {v.badge}
            </span>
          )}
          <div className="absolute bottom-3 right-3 glass rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-foreground/80">
            {v.brand}
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-display text-2xl leading-tight">
            {v.brand}{" "}
            <span className="text-muted-foreground">{v.model}</span>
          </h3>

          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            {[
              { l: tr("year"), v: v.year },
              { l: tr("km"), v: `${(v.km / 1000).toFixed(0)}K` },
              { l: tr("cc"), v: v.cc },
              { l: tr("fuel"), v: v.fuel.slice(0, 3) },
            ].map((c, i) => (
              <div key={i} className="glass rounded-lg py-2">
                <div className="font-mono text-sm font-semibold">{c.v}</div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  {c.l}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {tr("price")}
              </div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-gradient-red">
                {v.price > 0 ? `€ ${v.price.toLocaleString("el-GR")}` : "Κατόπιν Επικοινωνίας"}
              </div>
            </div>
            <a
              href={`/?vehicle=${v.id}#book`}
              onClick={(e) => e.stopPropagation()}
              className="btn-hero btn-hero-hover rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider"
            >
              {tr("ctaBook")}
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
