import { motion } from "framer-motion";
import { useLang } from "@/lib/language";

const shots = [
  { src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop", cls: "col-span-2 row-span-2" },
  { src: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80&auto=format&fit=crop", cls: "" },
  { src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80&auto=format&fit=crop", cls: "" },
  { src: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80&auto=format&fit=crop", cls: "col-span-2" },
  { src: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=80&auto=format&fit=crop", cls: "" },
  { src: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80&auto=format&fit=crop", cls: "" },
];

export function GallerySection() {
  const { tr } = useLang();
  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-xs font-mono uppercase tracking-widest text-primary">
            // SHOWROOM
          </div>
          <h2 className="mt-3 font-display text-5xl sm:text-6xl">{tr("galleryTitle")}</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] gap-4">
          {shots.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-2xl group ${s.cls}`}
            >
              <img
                src={s.src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent opacity-0 group-hover:opacity-100 transition" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
