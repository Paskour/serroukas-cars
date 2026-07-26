import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { useLang } from "@/lib/language";
import { vehicles } from "@/lib/vehicles";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  interest: "buy" | "rent" | "service";
  notes: string;
}

const initial: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  interest: "buy",
  notes: "",
};

export function AppointmentForm() {
  const { tr, lang } = useLang();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [done, setDone] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    const vehicleId = new URLSearchParams(window.location.search).get("vehicle");
    const vehicle = vehicles.find((item) => item.id === vehicleId);
    if (!vehicle) return;
    const name = `${vehicle.brand} ${vehicle.model}`;
    setSelectedVehicle(name);
    setData((current) => ({
      ...current,
      notes: current.notes || `Ενδιαφέρομαι για το ${name}.`,
    }));
  }, []);

  const steps = [tr("step1"), tr("step2"), tr("step3")];

  const set = (k: keyof FormData, v: string) => setData((d) => ({ ...d, [k]: v }));

  const submit = () => {
    try {
      const prev = JSON.parse(localStorage.getItem("serroukas_appointments") || "[]");
      prev.push({ ...data, createdAt: new Date().toISOString() });
      localStorage.setItem("serroukas_appointments", JSON.stringify(prev));
    } catch {}
    setDone(true);
  };

  const canNext =
    step === 0
      ? data.firstName && data.lastName && data.phone && data.email
      : true;

  return (
    <section id="book" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-xs font-mono uppercase tracking-widest text-primary">
            {tr("navBook")}
          </div>
          <h2 className="mt-3 font-display text-5xl sm:text-6xl">{tr("bookTitle")}</h2>
          <p className="mt-4 text-muted-foreground">{tr("bookSub")}</p>
          {selectedVehicle && (
            <p className="mt-3 text-sm font-semibold text-primary">Ραντεβού για: {selectedVehicle}</p>
          )}
        </motion.div>

        <div className="glass-strong rounded-3xl p-6 sm:p-10">
          {/* Stepper */}
          <div className="mb-8 flex items-center justify-between gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex items-center gap-3 min-w-0">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-sm transition ${
                    i <= step ? "btn-hero" : "glass text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <div
                  className={`text-xs sm:text-sm font-semibold truncate ${
                    i <= step ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block flex-1 h-px bg-white/10" />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full btn-hero mb-6">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="font-display text-3xl">{tr("submitted")}</h3>
                <p className="mt-3 text-muted-foreground">
                  {data.firstName}, {lang === "el" ? "θα σε καλέσουμε στο" : "we'll call you at"}{" "}
                  <span className="font-mono text-foreground">{data.phone}</span>.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={tr("firstName")} value={data.firstName} onChange={(v) => set("firstName", v)} />
                    <Field label={tr("lastName")} value={data.lastName} onChange={(v) => set("lastName", v)} />
                    <Field label={tr("phone")} value={data.phone} onChange={(v) => set("phone", v)} type="tel" />
                    <Field label={tr("email")} value={data.email} onChange={(v) => set("email", v)} type="email" />
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        {tr("interestType")}
                      </label>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {(["buy", "rent", "service"] as const).map((k) => (
                          <button
                            key={k}
                            onClick={() => set("interest", k)}
                            className={`rounded-2xl px-4 py-6 text-center transition font-semibold ${
                              data.interest === k
                                ? "btn-hero"
                                : "glass hover:bg-white/5"
                            }`}
                          >
                            {tr(k)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        {tr("notes")}
                      </label>
                      <textarea
                        value={data.notes}
                        onChange={(e) => set("notes", e.target.value)}
                        rows={4}
                        className="mt-2 w-full glass rounded-2xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-3">
                    {[
                      [tr("firstName"), data.firstName],
                      [tr("lastName"), data.lastName],
                      [tr("phone"), data.phone],
                      [tr("email"), data.email],
                      [tr("interestType"), tr(data.interest)],
                      [tr("notes"), data.notes || "—"],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="glass rounded-xl px-4 py-3 flex items-start justify-between gap-4"
                      >
                        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                          {k}
                        </div>
                        <div className="text-sm font-medium text-right break-words">{v}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="glass rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-40 hover:bg-white/5"
                  >
                    <ChevronLeft className="h-4 w-4" /> {tr("back")}
                  </button>
                  {step < steps.length - 1 ? (
                    <button
                      onClick={() => canNext && setStep((s) => s + 1)}
                      disabled={!canNext}
                      className="btn-hero btn-hero-hover rounded-full px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-40"
                    >
                      {tr("next")} <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={submit}
                      className="btn-hero btn-hero-hover rounded-full px-6 py-2.5 text-sm font-semibold"
                    >
                      {tr("submit")}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full glass rounded-2xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}
