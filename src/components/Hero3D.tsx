import { motion } from "framer-motion";
import { ShieldCheck, Award, Car, Sparkles, ArrowRight, CheckCircle2, Star, Zap } from "lucide-react";
import { useLang } from "@/lib/language";

export function Hero3D() {
  const { tr, lang } = useLang();

  const heroImage = "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1600&q=85&auto=format&fit=crop";

  const trustBadges = [
    { el: "100% Τεχνικός Έλεγχος", en: "100% Technical Inspection" },
    { el: "45 Χρόνια Εμπειρίας", en: "45 Years Experience" },
    { el: "Εγγύηση Ποιότητας", en: "Quality Guarantee" },
  ];

  return (
    <section id="home" className="relative min-h-dvh overflow-hidden pt-24 pb-16 flex items-center">
      {/* Dynamic Background Gradients */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-radial-red)" }}
      />
      <div
        aria-hidden
        className="absolute top-1/4 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl -z-10 animate-float"
      />
      <div
        aria-hidden
        className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl -z-10"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 items-center w-full">
        {/* Left Content Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 py-6 lg:py-12 lg:col-span-6"
        >
          {/* Hero Kicker */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-mono tracking-widest text-primary border border-primary/20 shadow-md">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            {tr("heroKicker")}
          </div>

          {/* Display Header */}
          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight uppercase">
            <span className="block">{tr("heroTitle1")}</span>
            <span className="block text-gradient-red">{tr("heroTitle2")}</span>
            <span className="block">{tr("heroTitle3")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            {tr("heroSub")}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#vehicles"
              className="btn-hero btn-hero-hover rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <span>{tr("ctaSee")}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#book"
              className="glass hover:bg-white/10 transition-all rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wider border border-white/10"
            >
              {tr("ctaBook")}
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted-foreground">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{lang === "el" ? badge.el : badge.en}</span>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
            {[
              { n: "45", label: tr("statYears"), icon: Award },
              { n: "1.200+", label: tr("statVehicles"), icon: Car },
              { n: "4", label: tr("statCategories"), icon: ShieldCheck },
            ].map((s, i) => {
              const IconComp = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="glass rounded-2xl p-4 border border-white/10 hover:border-primary/40 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-display text-3xl sm:text-4xl text-gradient-red">{s.n}</div>
                    <IconComp className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-mono">
                    {s.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Hero Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative lg:col-span-6 h-[440px] sm:h-[540px] lg:h-[620px] w-full"
        >
          {/* Main Card Container */}
          <div className="relative h-full w-full rounded-3xl overflow-hidden glass-strong border border-white/15 shadow-[var(--shadow-elegant)] group">
            {/* High-Resolution Hero Car Image positioned cleanly in top-center focus */}
            <img
              src={heroImage}
              alt="Serroukas Premium Fleet"
              decoding="async"
              className="h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/20" />

            {/* Corner Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs font-mono tracking-wider text-foreground border border-white/15 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-spin" style={{ animationDuration: '8s' }} />
              <span>PREMIUM SELECTION</span>
            </div>

            {/* Top Right Rating Badge */}
            <div className="absolute top-6 right-6 hidden sm:flex items-center gap-1.5 rounded-full glass-strong px-3.5 py-1.5 text-xs font-mono text-foreground border border-white/15 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="font-semibold">4.9 / 5.0</span>
            </div>

            {/* Compact Sleek Bottom Pill Showcase Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-4 left-4 right-4 glass-strong rounded-2xl px-5 py-3 border border-white/15 shadow-2xl flex items-center justify-between gap-3"
            >
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-primary">
                  SERROUKAS HQ · ARGOS
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-foreground leading-none mt-0.5">
                  SERROUKAS CARS FLEET
                </h3>
              </div>

              <a
                href="#vehicles"
                className="btn-hero btn-hero-hover rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider shrink-0"
              >
                {tr("ctaSee")}
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
