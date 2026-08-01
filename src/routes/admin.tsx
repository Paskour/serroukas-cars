import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  Car,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  LogOut,
  RefreshCw,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  ShieldAlert,
  Smartphone,
  Info,
  X,
  FileText,
  BadgeCheck,
} from "lucide-react";
import logo from "@/assets/serroukas-logo-white.png";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

// Initial mock vehicle data for the admin panel
interface AdminVehicle {
  id: string;
  name: string;
  category: "passenger" | "commercial" | "truck" | "machinery";
  price: string;
  year: string;
  status: "active" | "draft" | "sold";
  dateAdded: string;
}

const initialVehicles: AdminVehicle[] = [
  { id: "A180-3810", name: "Mercedes-Benz A180 AMG Line", category: "passenger", price: "€24,900", year: "2021", status: "active", dateAdded: "2026-07-28" },
  { id: "ATEGO-2807", name: "Mercedes-Benz Atego 1021 Box Truck", category: "truck", price: "€38,500", year: "2019", status: "active", dateAdded: "2026-07-20" },
  { id: "BERLINGO-3020", name: "Citroën Berlingo 1.5 BlueHDi Van", category: "commercial", price: "€16,400", year: "2022", status: "active", dateAdded: "2026-07-15" },
  { id: "CAT-320-112", name: "Caterpillar 320 Excavator", category: "machinery", price: "€85,000", year: "2018", status: "draft", dateAdded: "2026-07-10" },
  { id: "FIAT-500X-3215", name: "Fiat 500X 1.3 Multijet Cross", category: "passenger", price: "€17,800", year: "2020", status: "sold", dateAdded: "2026-06-30" },
];

interface AppointmentLead {
  id: string;
  customerName: string;
  phone: string;
  serviceType: "buy" | "rent" | "service";
  date: string;
  status: "pending" | "confirmed" | "completed";
}

const initialLeads: AppointmentLead[] = [
  { id: "L-101", customerName: "Γιώργος Παπαδόπουλος", phone: "+30 697 123 4567", serviceType: "buy", date: "2026-08-03 11:00", status: "pending" },
  { id: "L-102", customerName: "Νίκος Κωνσταντίνου", phone: "+30 694 987 6543", serviceType: "service", date: "2026-08-04 09:30", status: "confirmed" },
  { id: "L-103", customerName: "Ελένη Δημητρίου", phone: "+30 698 555 4321", serviceType: "rent", date: "2026-08-02 16:00", status: "completed" },
];

function AdminPage() {
  // Authentication states: "password" -> "2fa" -> "authenticated"
  const [authStage, setAuthStage] = useState<"password" | "2fa" | "authenticated">("password");
  
  // Credentials & Form States
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCodeInput, setBackupCodeInput] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  
  // Feedback & Loading
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(true);

  // Active Tab inside Admin Dashboard
  const [activeTab, setActiveTab] = useState<"overview" | "vehicles" | "leads" | "security">("overview");

  // 2FA Security Configuration
  const [totpEnabled, setTotpEnabled] = useState(true);
  const totpSecret = "JBSWY3DPEHPK3PXP";
  const [backupCodes, setBackupCodes] = useState([
    "8391-2049", "1048-9382", "5729-1102", "9940-3812",
    "4810-5592", "3019-8274", "7710-4493", "2059-6618"
  ]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Admin Data State
  const [vehicles, setVehicles] = useState<AdminVehicle[]>(initialVehicles);
  const [leads, setLeads] = useState<AppointmentLead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // New Vehicle Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<{
    name: string;
    category: "passenger" | "commercial" | "truck" | "machinery";
    price: string;
    year: string;
  }>({ name: "", category: "passenger", price: "", year: "2026" });

  // References for OTP inputs
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-clear error when user types
  useEffect(() => {
    if (errorMessage) setErrorMessage("");
  }, [username, password, otpDigits, backupCodeInput]);

  // Session expiry simulation (30 minute timer)
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(1800); // 30 minutes in seconds
  useEffect(() => {
    if (authStage !== "authenticated") return;
    const timer = setInterval(() => {
      setSessionTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAuthStage("password");
          setErrorMessage("Session expired due to inactivity. Please sign in again.");
          return 1800;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [authStage]);

  // Helper formatting for session clock
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 1: Submit Password Form
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Demo credentials validation: username 'admin' (or admin@serroukas-cars.gr) and password 'admin' or 'Serroukas2026!'
      // For smooth demo experience, any password containing 'admin' or matching 'Serroukas2026!' or length >= 4 passes
      if (
        (username.toLowerCase() === "admin" || username.toLowerCase().includes("serroukas")) &&
        (password.length >= 3)
      ) {
        setAuthStage("2fa");
        setErrorMessage("");
      } else {
        setErrorMessage("Invalid username or password. (Demo: admin / admin)");
      }
    }, 600);
  };

  // OTP Input change handler
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // OTP Keydown for backspace back-navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // OTP Paste handler
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  // Step 2: Submit 2FA Code
  const handle2faSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (useBackupCode) {
        if (backupCodes.includes(backupCodeInput.trim())) {
          // Consume backup code
          setBackupCodes(backupCodes.filter((c) => c !== backupCodeInput.trim()));
          setAuthStage("authenticated");
          setSessionTimeRemaining(1800);
          setErrorMessage("");
        } else {
          setErrorMessage("Invalid backup code. (Demo code: 8391-2049)");
        }
      } else {
        const fullCode = otpDigits.join("");
        if (fullCode.length < 6) {
          setErrorMessage("Please enter all 6 verification digits.");
          return;
        }

        // Demo rule: Any 6 digits work, or '123456'
        setAuthStage("authenticated");
        setSessionTimeRemaining(1800);
        setErrorMessage("");
      }
    }, 700);
  };

  // Fill demo credentials
  const fillDemoCredentials = () => {
    setUsername("admin@serroukas-cars.gr");
    setPassword("Serroukas2026!");
    setErrorMessage("");
  };

  // Fill demo 2FA code
  const fillDemo2FA = () => {
    setOtpDigits(["1", "2", "3", "4", "5", "6"]);
    setErrorMessage("");
  };

  // Handle vehicle deletion
  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  // Toggle vehicle status
  const handleToggleVehicleStatus = (id: string) => {
    setVehicles(
      vehicles.map((v) => {
        if (v.id === id) {
          const nextStatus: AdminVehicle["status"] =
            v.status === "active" ? "draft" : v.status === "draft" ? "sold" : "active";
          return { ...v, status: nextStatus };
        }
        return v;
      })
    );
  };

  // Add new vehicle submit
  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.name || !newVehicle.price) return;

    const created: AdminVehicle = {
      id: `VEH-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newVehicle.name,
      category: newVehicle.category,
      price: newVehicle.price.startsWith("€") ? newVehicle.price : `€${newVehicle.price}`,
      year: newVehicle.year,
      status: "active",
      dateAdded: new Date().toISOString().split("T")[0],
    };

    setVehicles([created, ...vehicles]);
    setIsAddModalOpen(false);
    setNewVehicle({ name: "", category: "passenger", price: "", year: "2026" });
  };

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtered vehicle list
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || v.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-dvh bg-background text-foreground selection:bg-primary selection:text-white relative overflow-hidden font-sans">
      {/* Background glowing blurred radial highlights */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none -z-10" />

      {/* Top Simple Banner Header for Auth Stages */}
      {authStage !== "authenticated" && (
        <header className="border-b border-white/10 bg-surface/40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Serroukas Cars Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            <span className="font-display font-bold tracking-wider text-lg text-white">SERROUKAS CARS</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-primary/10 border border-primary/20 text-primary">
              <Lock className="w-3 h-3" /> Secure Admin Portal
            </span>
            <Link to="/" className="text-xs font-medium text-muted-foreground hover:text-white transition-colors">
              Back to Site &rarr;
            </Link>
          </div>
        </header>
      )}

      {/* ========================================================================= */}
      {/* AUTH STAGE 1 & 2: LOGIN & 2FA PORTAL                                     */}
      {/* ========================================================================= */}
      {authStage !== "authenticated" && (
        <main className="flex min-h-[calc(100dvh-65px)] items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md">
            {/* Demo Helper Box */}
            {showDemoInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 glass-strong rounded-xl p-4 border border-amber-500/30 bg-amber-500/10 text-xs leading-relaxed relative"
              >
                <button
                  onClick={() => setShowDemoInfo(false)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-white"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300 uppercase tracking-wider block mb-1">
                      Demo Mode Info
                    </span>
                    <p className="text-amber-100/90 mb-2">
                      This page simulates a multi-factor protected admin panel. You can test both authentication stages with demo inputs:
                    </p>
                    <div className="grid grid-cols-2 gap-2 bg-black/40 p-2 rounded border border-amber-500/20 font-mono text-[11px]">
                      <div>
                        <span className="text-muted-foreground">Username:</span> admin
                      </div>
                      <div>
                        <span className="text-muted-foreground">Password:</span> admin
                      </div>
                      <div>
                        <span className="text-muted-foreground">2FA OTP:</span> 123456
                      </div>
                      <div>
                        <span className="text-muted-foreground">Backup Code:</span> 8391-2049
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Auth Glass Card */}
            <div className="glass-strong rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

              <AnimatePresence mode="wait">
                {/* ------------------------------------------------------------- */}
                {/* STEP 1: PASSWORD LOGIN                                        */}
                {/* ------------------------------------------------------------- */}
                {authStage === "password" && (
                  <motion.div
                    key="stage-password"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 text-primary mb-4 shadow-inner">
                        <Lock className="w-7 h-7" />
                      </div>
                      <h1 className="text-2xl font-bold font-display tracking-tight text-white">Admin Authentication</h1>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sign in to access the Serroukas Cars management dashboard.
                      </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                          Username or Email
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin@serroukas-cars.gr"
                            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={fillDemoCredentials}
                            className="text-[11px] text-primary hover:underline font-mono"
                          >
                            Auto-fill demo
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember me & Security indicator */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-white">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-white/20 bg-black/40 text-primary focus:ring-primary"
                          />
                          <span>Remember device</span>
                        </label>
                        <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" /> 2FA Enforced
                        </span>
                      </div>

                      {/* Error Message */}
                      {errorMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errorMessage}</span>
                        </motion.div>
                      )}

                      {/* Action Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-hero btn-hero-hover w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Verifying Credentials...
                          </>
                        ) : (
                          <>
                            Continue to 2FA Verification
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 2: TWO-FACTOR AUTHENTICATION (2FA)                       */}
                {/* ------------------------------------------------------------- */}
                {authStage === "2fa" && (
                  <motion.div
                    key="stage-2fa"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-4 shadow-inner">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <h1 className="text-2xl font-bold font-display tracking-tight text-white">Two-Factor Authentication</h1>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Enter the 6-digit TOTP code generated by your Authenticator app (e.g. Google Authenticator, 1Password).
                      </p>
                    </div>

                    <form onSubmit={handle2faSubmit} className="space-y-5">
                      {!useBackupCode ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                              Verification Code (OTP)
                            </span>
                            <button
                              type="button"
                              onClick={fillDemo2FA}
                              className="text-[11px] text-amber-400 hover:underline font-mono"
                            >
                              Auto-fill 123456
                            </button>
                          </div>

                          {/* 6 Digit Input Boxes */}
                          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                            {otpDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                ref={(el) => (otpInputRefs.current[idx] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                onPaste={handleOtpPaste}
                                className="w-11 sm:w-12 h-13 text-center text-xl font-bold font-mono bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                            Emergency Backup Code
                          </label>
                          <input
                            type="text"
                            value={backupCodeInput}
                            onChange={(e) => setBackupCodeInput(e.target.value)}
                            placeholder="e.g. 8391-2049"
                            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400 font-mono tracking-widest text-center uppercase"
                          />
                        </div>
                      )}

                      {/* Toggle Backup Code Mode */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setUseBackupCode(!useBackupCode);
                            setErrorMessage("");
                          }}
                          className="text-xs text-muted-foreground hover:text-white underline transition-colors"
                        >
                          {useBackupCode ? "Use Authenticator App OTP Code" : "Lost access? Use emergency backup code"}
                        </button>
                      </div>

                      {/* Error Display */}
                      {errorMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errorMessage}</span>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Authenticating...
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4" />
                              Verify & Access Admin Panel
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAuthStage("password");
                            setErrorMessage("");
                          }}
                          className="w-full py-2.5 rounded-xl font-medium text-xs text-muted-foreground hover:text-white transition-colors"
                        >
                          &larr; Back to Password Step
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* AUTH STAGE 3: PROTECTED ADMIN PANEL DASHBOARD                           */}
      {/* ========================================================================= */}
      {authStage === "authenticated" && (
        <div className="min-h-dvh flex flex-col bg-background">
          {/* Admin Header */}
          <header className="sticky top-0 z-40 border-b border-white/10 bg-surface/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Serroukas Cars Logo" className="h-9 w-auto object-contain" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-white text-base tracking-wide">SERROUKAS CARS</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" /> 2FA Verified
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block -mt-0.5">Control Center v2.4</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1 ml-4 border-l border-white/10 pl-6">
                {[
                  { id: "overview", label: "Overview", icon: Users },
                  { id: "vehicles", label: "Vehicles", icon: Car },
                  { id: "leads", label: "Inquiries & Leads", icon: FileText },
                  { id: "security", label: "Security & 2FA", icon: ShieldCheck },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                        active
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right Status Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Session: {formatTime(sessionTimeRemaining)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn-hero btn-hero-hover text-xs px-3.5 py-1.5 rounded-lg font-medium hidden sm:flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> New Vehicle
                </button>

                <button
                  onClick={() => {
                    setAuthStage("password");
                    setPassword("");
                    setOtpDigits(["", "", "", "", "", ""]);
                  }}
                  className="glass-strong hover:bg-red-500/20 hover:border-red-500/30 text-xs px-3 py-1.5 rounded-lg font-medium text-red-400 border border-white/10 flex items-center gap-1.5 transition-all"
                  title="Sign out of admin session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </header>

          {/* Mobile Navigation Tabs */}
          <div className="md:hidden flex items-center gap-1 px-4 py-2 bg-surface/40 border-b border-white/10 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Users },
              { id: "vehicles", label: "Vehicles", icon: Car },
              { id: "leads", label: "Inquiries", icon: FileText },
              { id: "security", label: "Security & 2FA", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all ${
                    active ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Dashboard Main Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Welcome & Stats Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold font-display text-white">System Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                      Welcome back, <span className="text-white font-mono font-medium">Administrator</span>. Overview of fleet activity and security.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Server Online
                    </span>
                  </div>
                </div>

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-strong rounded-xl p-5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
                      <span>TOTAL VEHICLES</span>
                      <Car className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-3xl font-extrabold font-display text-white">{vehicles.length}</div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <span>+2 added this week</span>
                    </div>
                  </div>

                  <div className="glass-strong rounded-xl p-5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
                      <span>INQUIRIES & LEADS</span>
                      <FileText className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-3xl font-extrabold font-display text-white">{leads.length}</div>
                    <div className="text-[11px] text-amber-300">
                      <span>1 pending review</span>
                    </div>
                  </div>

                  <div className="glass-strong rounded-xl p-5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
                      <span>FLEET VALUE</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-extrabold font-display text-white">€182,600</div>
                    <div className="text-[11px] text-muted-foreground">Active catalog inventory</div>
                  </div>

                  <div className="glass-strong rounded-xl p-5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
                      <span>2FA PROTECTION</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-extrabold font-display text-emerald-400">ENFORCED</div>
                    <div className="text-[11px] text-emerald-400/80">TOTP Authenticator active</div>
                  </div>
                </div>

                {/* Recent Vehicles Quick List */}
                <div className="glass-strong rounded-2xl p-6 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white font-display">Recent Inventory</h2>
                      <p className="text-xs text-muted-foreground">Manage vehicles published in the showcase.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("vehicles")}
                      className="text-xs text-primary hover:underline font-mono flex items-center gap-1"
                    >
                      View All Vehicles ({vehicles.length}) &rarr;
                    </button>
                  </div>

                  <div className="divide-y divide-white/5">
                    {vehicles.slice(0, 3).map((v) => (
                      <div key={v.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                            <Car className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{v.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              ID: {v.id} · Category: {v.category.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold font-mono text-white">{v.price}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              v.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : v.status === "draft"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {v.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: VEHICLE MANAGEMENT */}
            {activeTab === "vehicles" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold font-display text-white">Vehicle Inventory</h1>
                    <p className="text-sm text-muted-foreground">Add, edit, and toggle status of dealership listings.</p>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-hero btn-hero-hover text-xs px-4 py-2.5 rounded-xl font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add New Vehicle
                  </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or ID..."
                      className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                    {[
                      { id: "all", label: "All Categories" },
                      { id: "passenger", label: "Passenger" },
                      { id: "commercial", label: "Commercial" },
                      { id: "truck", label: "Trucks" },
                      { id: "machinery", label: "Machinery" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                          categoryFilter === cat.id ? "bg-white/15 text-white border border-white/20" : "text-muted-foreground hover:text-white"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="glass-strong rounded-2xl border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black/50 border-b border-white/10 font-mono text-muted-foreground uppercase text-[11px]">
                        <tr>
                          <th className="p-4">Vehicle</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Year</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-medium">
                        {filteredVehicles.map((v) => (
                          <tr key={v.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <div className="font-semibold text-white text-sm">{v.name}</div>
                              <div className="text-[11px] text-muted-foreground font-mono">{v.id}</div>
                            </td>
                            <td className="p-4 capitalize text-muted-foreground font-mono">{v.category}</td>
                            <td className="p-4 font-mono text-white">{v.year}</td>
                            <td className="p-4 font-bold font-mono text-white">{v.price}</td>
                            <td className="p-4">
                              <button
                                onClick={() => handleToggleVehicleStatus(v.id)}
                                title="Click to cycle status"
                                className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold transition-transform active:scale-95 ${
                                  v.status === "active"
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    : v.status === "draft"
                                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                                }`}
                              >
                                {v.status}
                              </button>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleDeleteVehicle(v.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
                                  title="Delete Vehicle"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredVehicles.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                              No vehicles found matching criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: INQUIRIES & LEADS */}
            {activeTab === "leads" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold font-display text-white">Appointments & Inquiries</h1>
                  <p className="text-sm text-muted-foreground">Customer test-drives, appointment bookings, and inquiries.</p>
                </div>

                <div className="glass-strong rounded-2xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/50 border-b border-white/10 font-mono text-muted-foreground uppercase text-[11px]">
                      <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Requested Time</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {leads.map((l) => (
                        <tr key={l.id} className="hover:bg-white/5">
                          <td className="p-4">
                            <div className="font-semibold text-white">{l.customerName}</div>
                            <div className="text-[11px] text-muted-foreground font-mono">{l.id}</div>
                          </td>
                          <td className="p-4 font-mono text-muted-foreground">{l.phone}</td>
                          <td className="p-4 font-mono uppercase text-primary">{l.serviceType}</td>
                          <td className="p-4 font-mono text-white">{l.date}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                                l.status === "completed"
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : l.status === "confirmed"
                                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 4: SECURITY & 2FA SETTINGS */}
            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
                <div>
                  <h1 className="text-2xl font-bold font-display text-white">Security & 2FA Configuration</h1>
                  <p className="text-sm text-muted-foreground">Manage multi-factor authentication, secret TOTP keys, and emergency backup codes.</p>
                </div>

                {/* 2FA Status Card */}
                <div className="glass-strong rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">Two-Factor Authentication is ACTIVE</h2>
                        <p className="text-xs text-muted-foreground">Your administrator account requires a 6-digit TOTP code on every login.</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                      PROTECTED
                    </span>
                  </div>

                  <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                      <span className="text-muted-foreground block text-[11px] mb-1">TOTP SECRET KEY</span>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold tracking-widest">{totpSecret}</span>
                        <button
                          onClick={() => handleCopy(totpSecret, "secret")}
                          className="text-muted-foreground hover:text-white p-1"
                          title="Copy Secret Key"
                        >
                          {copiedCode === "secret" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                      <span className="text-muted-foreground block text-[11px] mb-1">AUTHENTICATOR APP</span>
                      <span className="text-white font-medium">Google Authenticator / Authy / 1Password</span>
                    </div>
                  </div>
                </div>

                {/* Backup Codes Section */}
                <div className="glass-strong rounded-2xl p-6 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-white">Emergency Backup Codes</h2>
                      <p className="text-xs text-muted-foreground">Keep these single-use recovery codes safe in case you lose your phone or 2FA app.</p>
                    </div>
                    <button
                      onClick={() => handleCopy(backupCodes.join("\n"), "all-codes")}
                      className="glass px-3 py-1.5 rounded-lg text-xs font-mono text-white hover:bg-white/10 flex items-center gap-1.5"
                    >
                      {copiedCode === "all-codes" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy All Codes
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                    {backupCodes.map((code, idx) => (
                      <div key={idx} className="bg-black/50 p-2.5 rounded-lg border border-white/10 text-center text-amber-200/90 tracking-wider">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD VEHICLE MODAL                                                         */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold font-display text-white mb-4">Add New Showcase Vehicle</h2>

            <form onSubmit={handleAddVehicleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1 uppercase">Vehicle Name & Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audi A4 2.0 TDI S-Line"
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1 uppercase">Category</label>
                  <select
                    value={newVehicle.category}
                    onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value as any })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="passenger">Passenger</option>
                    <option value="commercial">Commercial</option>
                    <option value="truck">Truck</option>
                    <option value="machinery">Machinery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1 uppercase">Year</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1 uppercase">Price (€)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. €21,500"
                  value={newVehicle.price}
                  onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-hero btn-hero-hover px-4 py-2 rounded-xl text-xs font-medium"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
