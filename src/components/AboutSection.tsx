import { motion } from "framer-motion";
import { useLang } from "@/lib/language";

const milestones = [
  { year: "1980", el: "Ίδρυση της επιχείρησης στο Άργος από την οικογένεια Σερρούκα.", en: "The Serroukas family opens its first office in Argos." },
  { year: "1998", el: "Επέκταση στα επαγγελματικά οχήματα και φορτηγά.", en: "Expansion into commercial vehicles and trucks." },
  { year: "2012", el: "Νέες σύγχρονες εγκαταστάσεις στο Άργος με πλήρες after-sales.", en: "New modern facilities in Argos with full after-sales service." },
  { year: "Σήμερα", el: "1.200+ οχήματα και τέσσερις κατηγορίες.", en: "1,200+ vehicles across four categories." },
];

export function AboutSection() {
  const { lang, tr } = useLang();

  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-primary/15 blur-3xl -z-10"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-12 lg:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-strong order-2 lg:order-1"
        >
          <img
            src="https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=1200&q=80&auto=format&fit=crop"
            alt="Serroukas Location"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent" />
          <div className="absolute bottom-6 left-6 right-6 glass-strong rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-primary font-mono">
              ARGOS · ΑΡΓΟΛΙΔΑ
            </div>
            <div className="mt-1 font-display text-2xl">Serroukas HQ</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="order-1 lg:order-2"
        >
          <div className="text-xs font-mono uppercase tracking-widest text-primary">
            {tr("aboutKicker")}
          </div>
          <h2 className="mt-3 font-display text-5xl sm:text-6xl leading-[0.95]">
            {tr("aboutTitle")}
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">{tr("aboutText")}</p>

          <ol className="mt-10 relative border-l border-white/10 pl-6 space-y-6">
            {milestones.map((m, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full btn-hero" />
                <div className="font-mono text-sm text-accent">{m.year}</div>
                <div className="mt-1 text-foreground/90">{lang === "el" ? m.el : m.en}</div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
