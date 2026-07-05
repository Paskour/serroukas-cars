import { Phone, Mail, MapPin, Clock } from "lucide-react";
import logo from "@/assets/serroukas-logo-white.png";
import { useLang } from "@/lib/language";

export function Footer() {
  const { tr } = useLang();
  return (
    <footer className="relative border-t border-white/5 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logo} alt="Serroukas Cars" className="h-56 md:h-60 w-auto" />
          <p className="mt-4 text-muted-foreground max-w-sm">
            Serroukas Cars — Car · Van · Truck. Άργος, Αργολίδα, από το 1980.
          </p>
        </div>

        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">
            {tr("navContact")}
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" /> +30 27510 00000
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" /> info@serroukas-cars.gr
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" /> Άργος, Αργολίδα
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">
            {tr("footerHours")}
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground font-mono">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Δευ–Παρ 09:00–20:00
            </li>
            <li>Σαβ 09:00–14:00</li>
            <li>Κυρ κλειστά</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Serroukas Cars · Car · Van · Truck
      </div>
    </footer>
  );
}
