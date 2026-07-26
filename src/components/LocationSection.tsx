import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Navigation, Car, ShieldCheck, Wrench, ExternalLink } from "lucide-react";
import { useLang } from "@/lib/language";

export function LocationSection() {
  const { tr } = useLang();
  
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Ioannou+Georgiou+Tsagkari+Argos+21200";
  const mapEmbedUrl = "https://maps.google.com/maps?q=Ioannou%20Georgiou%20Tsagkari,%20Argos%20212%2000,%20Greece&t=&z=15&ie=UTF8&iwloc=&output=embed";

  const features = [
    {
      icon: Car,
      titleKey: "locationParkingTitle",
      subKey: "locationParkingSub",
    },
    {
      icon: ShieldCheck,
      titleKey: "locationTestDriveTitle",
      subKey: "locationTestDriveSub",
    },
    {
      icon: Wrench,
      titleKey: "locationServiceTitle",
      subKey: "locationServiceSub",
    },
  ] as const;

  return (
    <section id="location" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl -z-10"
      />
      <div
        aria-hidden
        className="absolute left-1/3 bottom-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl -z-10"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="text-xs font-mono uppercase tracking-widest text-primary">
            // {tr("locationKicker")}
          </div>
          <h2 className="mt-3 font-display text-5xl sm:text-6xl leading-tight">
            {tr("locationTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
            {tr("locationSub")}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Information & Features Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between space-y-6"
          >
            {/* Main Info Card */}
            <div className="glass-strong rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <MapPin className="w-48 h-48 text-primary" />
              </div>

              {/* Address detail */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-1">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {tr("locationAddressLabel")}
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    Ioannou Georgiou Tsagκari, Argos 212 00
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {tr("locationAddress")}
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-1">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {tr("locationHoursLabel")}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {tr("locationHoursValue")}
                  </p>
                </div>
              </div>

              {/* Contact Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-1">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {tr("locationPhoneLabel")}
                  </h3>
                  <a
                    href="tel:+302751000000"
                    className="mt-1 text-base font-semibold text-foreground hover:text-primary transition-colors inline-block"
                  >
                    {tr("locationPhoneValue")}
                  </a>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hero btn-hero-hover rounded-2xl py-3.5 px-6 w-full flex items-center justify-center gap-2.5 font-semibold text-sm transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{tr("locationDirections")}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>

            {/* Facility Highlights Grid */}
            <div className="grid gap-3 sm:grid-cols-3">
              {features.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={idx}
                    className="glass rounded-2xl p-4 border border-white/5 flex flex-col items-start gap-2 hover:border-primary/30 transition-colors"
                  >
                    <IconComponent className="w-5 h-5 text-accent" />
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">
                        {tr(feat.titleKey as any)}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-1">
                        {tr(feat.subKey as any)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Interactive Map Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="relative h-full min-h-[380px] sm:min-h-[460px] rounded-3xl overflow-hidden glass-strong border border-white/10 shadow-2xl group">
              <iframe
                title="Serroukas Cars Location Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                className="w-full h-full min-h-[380px] sm:min-h-[460px] border-0 filter grayscale contrast-125 brightness-90 hover:filter-none transition-all duration-700"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              {/* Map Floating Tag */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto glass-strong rounded-2xl p-3.5 px-5 flex items-center gap-3 border border-white/10 shadow-lg pointer-events-none">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse shrink-0" />
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-primary">
                    ARGOS · 212 00
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Ioannou Georgiou Tsagκari
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
