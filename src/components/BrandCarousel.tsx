import { brands } from "@/lib/vehicles";

export function BrandCarousel() {
  const items = [...brands, ...brands, ...brands];
  return (
    <section
      aria-label="Brands"
      className="relative py-14 border-y border-white/5 overflow-hidden bg-surface/40"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="marquee-track flex items-center gap-10 sm:gap-16 whitespace-nowrap w-max">
        {items.map((b, i) => (
          <div
            key={i}
            className="group flex items-center gap-4 shrink-0"
            title={b.name}
          >
            <div className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-2xl glass p-3 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105">
              <img
                src={b.logo}
                alt={b.name}
                loading="lazy"
                className={`max-h-full max-w-full object-contain opacity-80 transition group-hover:opacity-100 ${
                  b.name === "Nissan" ? "brightness-0 invert" : ""
                }`}
              />
            </div>
            <span className="font-display text-xl sm:text-2xl text-muted-foreground/70 group-hover:text-foreground transition-colors tracking-widest">
              {b.name.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
