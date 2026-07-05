import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
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
    { href: "#gallery", label: tr("navGallery") },
    { href: "#book", label: tr("navBook") },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong py-2 shadow-[var(--shadow-elegant)]" : "py-4 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="Serroukas Cars" className="h-40 md:h-48 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="hidden sm:grid h-10 w-10 place-items-center rounded-full glass hover:bg-white/5 transition"
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="glass rounded-full p-1 flex items-center text-xs font-mono">
            {(["el", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full transition-all ${
                  lang === l ? "btn-hero" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href="#book"
            className="hidden md:inline-flex btn-hero btn-hero-hover rounded-full px-5 py-2 text-sm font-semibold"
          >
            {tr("ctaBook")}
          </a>
          <button
            className="md:hidden grid h-10 w-10 place-items-center rounded-full glass"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-strong mx-4 mt-2 rounded-2xl p-4 flex flex-col gap-3"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
