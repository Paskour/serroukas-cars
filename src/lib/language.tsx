import { createContext, useContext, useState, useMemo, type ReactNode } from "react";

export type Lang = "el" | "en";

type Dict = Record<string, { el: string; en: string }>;

export const t: Dict = {
  navHome: { el: "Αρχική", en: "Home" },
  navVehicles: { el: "Οχήματα", en: "Vehicles" },
  navAbout: { el: "Η Εταιρεία", en: "About" },
  navLocation: { el: "Τοποθεσία", en: "Location" },
  navContact: { el: "Επικοινωνία", en: "Contact" },
  navBook: { el: "Ραντεβού", en: "Book" },
  heroKicker: { el: "SERROUKAS CARS · ΑΡΓΟΣ · 1980", en: "SERROUKAS CARS · ARGOS · 1980" },
  heroTitle1: { el: "ΚΙΝΗΣΗ", en: "MOTION" },
  heroTitle2: { el: "ΠΟΥ ΕΜΠΝΕΕΙ", en: "THAT INSPIRES" },
  heroTitle3: { el: "ΕΜΠΙΣΤΟΣΥΝΗ", en: "TRUST" },
  heroSub: {
    el: "Επιβατικά, επαγγελματικά, φορτηγά και μηχανήματα από την οικογένεια Σερούκα εδώ και 45 χρόνια.",
    en: "Passenger cars, vans, trucks and machinery from the Serroukas family for 45 years.",
  },
  ctaSee: { el: "Δες τα Οχήματα", en: "Browse Vehicles" },
  ctaBook: { el: "Κλείσε Ραντεβού", en: "Book Appointment" },
  statYears: { el: "Χρόνια Εμπειρίας", en: "Years of experience" },
  statVehicles: { el: "Οχήματα Πωλήθηκαν", en: "Vehicles sold" },
  statCategories: { el: "Κατηγορίες Οχημάτων", en: "Vehicle categories" },
  featuredTitle: { el: "Νέες Αφίξεις", en: "New Arrivals" },
  featuredSub: {
    el: "Επιλεγμένα οχήματα από το τρέχον απόθεμά μας.",
    en: "Hand-picked vehicles from our current stock.",
  },
  filtersType: { el: "Τύπος", en: "Type" },
  typePassenger: { el: "Επιβατικά", en: "Passenger" },
  typeCommercial: { el: "Επαγγελματικά", en: "Commercial" },
  typeTruck: { el: "Φορτηγά", en: "Trucks" },
  typeMachine: { el: "Μηχανήματα", en: "Machinery" },
  brand: { el: "Μάρκα", en: "Brand" },
  all: { el: "Όλες", en: "All" },
  aboutKicker: { el: "Η ΙΣΤΟΡΙΑ ΜΑΣ", en: "OUR STORY" },
  aboutTitle: { el: "Τέσσερις δεκαετίες στον δρόμο.", en: "Four decades on the road." },
  aboutText: {
    el: "Από το 1980, η οικογένεια Σερούκα εξυπηρετεί την Αργολίδα με αξιοπιστία, διαφάνεια και βαθιά γνώση της αγοράς αυτοκινήτου — από το πρώτο μικρό γραφείο στο Άργος μέχρι τις σημερινές σύγχρονες εγκαταστάσεις μας στην Ιωάννου Γεωργίου Τσαγκάρη.",
    en: "Since 1980, the Serroukas family has been serving Argolida with reliability, transparency, and deep automotive expertise — from a small office in Argos to today's modern facilities on Ioannou Georgiou Tsagkari.",
  },
  locationKicker: { el: "Η ΤΟΠΟΘΕΣΙΑ ΜΑΣ", en: "OUR LOCATION" },
  locationTitle: { el: "Επισκεφθείτε μας στο Άργος", en: "Visit Us in Argos" },
  locationSub: {
    el: "Ελάτε από τις σύγχρονες εγκαταστάσεις μας στην Ιωάννου Γεωργίου Τσαγκάρη για να δείτε από κοντά το στόλο οχημάτων μας.",
    en: "Visit our modern facilities at Ioannou Georgiou Tsagkari to view our vehicle fleet in person.",
  },
  locationAddressLabel: { el: "Διεύθυνση", en: "Address" },
  locationAddress: { el: "Ιωάννου Γεωργίου Τσαγκάρη, Άργος 212 00", en: "Ioannou Georgiou Tsagkari, Argos 212 00" },
  locationDirections: { el: "Οδηγίες στο Χάρτη", en: "Get Directions" },
  locationHoursLabel: { el: "Ωράριο Λειτουργίας", en: "Operating Hours" },
  locationHoursValue: { el: "Δευ – Παρ: 09:00 – 20:00 | Σαβ: 09:00 – 14:00", en: "Mon – Fri: 09:00 – 20:00 | Sat: 09:00 – 14:00" },
  locationPhoneLabel: { el: "Τηλέφωνο Επικοινωνίας", en: "Contact Phone" },
  locationPhoneValue: { el: "+30 27510 00000", en: "+30 27510 00000" },
  locationParkingTitle: { el: "Ιδιωτικό Πάρκινγκ", en: "Private Parking" },
  locationParkingSub: { el: "Άνετος χώρος στάθμευσης για όλους τους επισκέπτες μας.", en: "Spacious parking area for all our visitors." },
  locationTestDriveTitle: { el: "Χώρος Δοκιμών (Test Drive)", en: "Test Drive Area" },
  locationTestDriveSub: { el: "Δυνατότητα άμεσης δοκιμαστικής οδήγησης.", en: "Opportunity for an immediate test drive." },
  locationServiceTitle: { el: "Τεχνικός Έλεγχος & After-Sales", en: "Inspection & After-Sales" },
  locationServiceSub: { el: "Πλήρης τεχνική υποστήριξη και συντήρηση οχημάτων.", en: "Full technical support and vehicle maintenance." },
  showingVehicles: { el: "Εμφάνιση", en: "Showing" },
  ofTotal: { el: "από", en: "of" },
  vehiclesCount: { el: "οχήματα", en: "vehicles" },
  loadMore: { el: "Φόρτωση Περισσότερων Οχημάτων", en: "Load More Vehicles" },
  showLess: { el: "Εμφάνιση Αρχικών", en: "Show Initial" },
  noVehicles: { el: "Δεν βρέθηκαν οχήματα με τα επιλεγμένα φίλτρα.", en: "No vehicles found matching the selected filters." },
  bookTitle: { el: "Κλείσε το Ραντεβού σου", en: "Book Your Appointment" },
  bookSub: {
    el: "Συμπλήρωσε τη φόρμα και θα επικοινωνήσουμε μαζί σου μέσα σε 24 ώρες.",
    en: "Fill out the form and we'll get back to you within 24 hours.",
  },
  step1: { el: "Στοιχεία", en: "Details" },
  step2: { el: "Ενδιαφέρον", en: "Interest" },
  step3: { el: "Επιβεβαίωση", en: "Confirm" },
  firstName: { el: "Όνομα", en: "First name" },
  lastName: { el: "Επώνυμο", en: "Last name" },
  phone: { el: "Τηλέφωνο", en: "Phone" },
  email: { el: "Email", en: "Email" },
  interestType: { el: "Τύπος ενδιαφέροντος", en: "Interest type" },
  buy: { el: "Αγορά", en: "Purchase" },
  rent: { el: "Ενοικίαση", en: "Rental" },
  service: { el: "Service", en: "Service" },
  notes: { el: "Σχόλια", en: "Notes" },
  next: { el: "Επόμενο", en: "Next" },
  back: { el: "Πίσω", en: "Back" },
  submit: { el: "Αποστολή", en: "Submit" },
  submitted: { el: "Ευχαριστούμε! Το αίτημα καταχωρήθηκε.", en: "Thanks! Your request has been submitted." },
  footerHours: { el: "Ωράριο", en: "Hours" },
  footerAddress: { el: "Διεύθυνση", en: "Address" },
  year: { el: "Έτος", en: "Year" },
  km: { el: "Χλμ", en: "KM" },
  fuel: { el: "Καύσιμο", en: "Fuel" },
  cc: { el: "Κυβικά", en: "cc" },
  price: { el: "Τιμή", en: "Price" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; tr: (key: keyof typeof t) => string };

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("el");
  const value = useMemo<Ctx>(
    () => ({ lang, setLang, tr: (key) => t[key]?.[lang] ?? String(key) }),
    [lang],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
