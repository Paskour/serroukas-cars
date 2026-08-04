import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/serroukas-logo-white.png";
import { useLang } from "@/lib/language";

export function Navbar() {
  const { lang, setLang, tr } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#vehicles", label: tr("navVehicles") },
    { href: "#about", label: tr("navAbout") },
    { href: "#location", label: tr("navLocation") },
    { href: "#book", label: tr("navBook") },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong py-1.5 shadow-[var(--shadow-elegant)]" : "py-2.5 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        {/* Logo - Scaled visually up without inflating bar height */}
        <Link to="/" className="flex shrink-0 items-center overflow-visible py-0.5">
          <img
            src={logo}
            alt="Serroukas Cars"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain scale-110 sm:scale-125 origin-left transition-transform duration-300 drop-shadow-lg"
          />
        </Link>

        {/* Larger Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-display text-xl font-bold uppercase tracking-wider text-foreground/90 hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[3px] after:w-0 hover:after:w-full after:bg-primary after:transition-all"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Larger Control Buttons */}
        <div className="flex items-center gap-3">
          <div className="glass rounded-full p-1 flex items-center text-sm font-display font-bold">
            {(["el", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  lang === l ? "btn-hero shadow-md font-extrabold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <a
            href="#book"
            className="hidden sm:inline-flex btn-hero btn-hero-hover rounded-full px-7 py-3 text-base font-display font-bold uppercase tracking-wider items-center gap-2.5"
          >
            <span>{tr("navBook")}</span>
          </a>

          <button
            className="md:hidden grid h-12 w-12 place-items-center rounded-full glass"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-6.5 w-6.5 text-foreground" /> : <Menu className="h-6.5 w-6.5 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-strong mx-4 mt-2 rounded-2xl p-6 flex flex-col gap-4 border border-white/10 shadow-2xl"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-xl font-bold border-b border-white/5 last:border-b-0"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#book"
            onClick={() => setOpen(false)}
            className="btn-hero btn-hero-hover rounded-full py-3.5 text-center text-base font-bold mt-2"
          >
            {tr("ctaBook")}
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
