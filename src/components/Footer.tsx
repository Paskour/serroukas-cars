import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/serroukas-logo-white.png";
import { useLang } from "@/lib/language";

export function Footer() {
  const { tr } = useLang();
  return (
    <footer className="relative border-t border-white/10 mt-24 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 grid gap-12 md:grid-cols-4">
        {/* Company Info */}
        <div className="md:col-span-2 space-y-4">
          <img src={logo} alt="Serroukas Cars" className="h-32 sm:h-44 md:h-52 w-auto object-contain" />
          <p className="text-base sm:text-lg text-muted-foreground max-w-md font-medium leading-relaxed">
            Serroukas Cars — Car · Van · Truck. Άργος, Αργολίδα, από το 1980.
          </p>
        </div>

        {/* Contact Column */}
        <div>
          <div className="text-sm font-mono uppercase tracking-widest text-primary font-bold mb-5">
            {tr("navContact")}
          </div>
          <ul className="space-y-4 text-base font-medium">
            <li className="flex items-center gap-3 text-foreground/90">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <a href="tel:+302751000000" className="hover:text-primary transition-colors">
                +30 27510 00000
              </a>
            </li>
            <li className="flex items-center gap-3 text-foreground/90">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <a href="mailto:info@serroukas-cars.gr" className="hover:text-primary transition-colors">
                info@serroukas-cars.gr
              </a>
            </li>
            <li className="flex items-start gap-3 text-foreground/90">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>{tr("locationAddress")}</span>
            </li>
          </ul>
        </div>

        {/* Operating Hours Column */}
        <div>
          <div className="text-sm font-mono uppercase tracking-widest text-primary font-bold mb-5">
            {tr("footerHours")}
          </div>
          <ul className="space-y-3 text-base text-foreground/90 font-mono">
            <li className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <span>Δευ – Παρ 09:00 – 20:00</span>
            </li>
            <li className="pl-8">Σαβ 09:00 – 14:00</li>
            <li className="pl-8 text-muted-foreground">Κυρ κλειστά</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-8 px-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto text-sm font-medium text-muted-foreground">
        <div>
          © {new Date().getFullYear()} Serroukas Cars · Car · Van · Truck · Argos
        </div>
        <Link to="/admin" className="hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono">
          <span>Admin Portal</span>
        </Link>
      </div>
    </footer>
  );
}
