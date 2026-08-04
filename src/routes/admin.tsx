import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Plus,
  Search,
  Trash2,
  Edit3,
  LogOut,
  Clock,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  Filter,
  RefreshCw,
  Check,
  ShieldCheck,
  Mail,
  Tag,
  Settings,
  GripVertical,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import logo from "@/assets/serroukas-logo-white.png";
import { Vehicle, VehicleAttribute, getDefaultVehicleAttributes } from "@/lib/vehicles";
import { verifyAdminPasswordFn, verifyAdmin2FAFn } from "@/lib/admin-auth";
import { saveVehiclePhotosToDiskFn } from "@/lib/photo-storage";
import { useVehiclesStore, useBrandsStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

/**
 * DEV FLAG: Set to `true` to temporarily bypass login & 2FA prompts during debugging.
 * Set to `false` (active) to enforce full 2FA authentication flow.
 */
// export const DEV_BYPASS_AUTH = true; // Commented out to enable 2FA Login Screen
export const DEV_BYPASS_AUTH = false;

function AdminPage() {
  // Authentication stages: "password" -> "2fa" -> "authenticated"
  const [authStage, setAuthStage] = useState<"password" | "2fa" | "authenticated">(
    DEV_BYPASS_AUTH ? "authenticated" : "password"
  );

  // Persistent vehicles and brands store
  const [vehicles, setVehicles] = useVehiclesStore();
  const { brands, addBrand, removeBrand } = useBrandsStore();

  // Credentials & Challenge States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("whatdoesthejimsay.jj@gmail.com");

  // 2FA OTP Digits
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Feedback & Loading
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>("all");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isEditingPriceOnRequest, setIsEditingPriceOnRequest] = useState(false);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);
  // Vehicle Attributes State (Dynamic specs table)
  const [editingAttributes, setEditingAttributes] = useState<VehicleAttribute[]>([]);
  const [newVehicleAttributes, setNewVehicleAttributes] = useState<VehicleAttribute[]>([
    { name: "Χιλιόμετρα", value: "" },
    { name: "Κυβικά", value: "1461 cc" },
    { name: "Χρονολογία", value: new Date().getFullYear().toString() },
    { name: "Ίπποι", value: "116 hp" },
    { name: "Καύσιμο", value: "Πετρέλαιο" },
    { name: "Σασμάν", value: "Χειροκίνητο" },
    { name: "Κίνηση", value: "Προσθιοκίνητο" },
    { name: "Πόρτες", value: "5" },
    { name: "Καθίσματα", value: "5" },
  ]);

  // Attribute Handlers for Edit Modal
  const handleAttributeChange = (index: number, field: "name" | "value", val: string) => {
    const updated = [...editingAttributes];
    updated[index] = { ...updated[index], [field]: val };
    setEditingAttributes(updated);
  };

  const handleAddAttribute = () => {
    setEditingAttributes([...editingAttributes, { name: "", value: "" }]);
  };

  const handleRemoveAttribute = (index: number) => {
    setEditingAttributes(editingAttributes.filter((_, i) => i !== index));
  };

  // Attribute Handlers for Add Modal
  const handleNewAttributeChange = (index: number, field: "name" | "value", val: string) => {
    const updated = [...newVehicleAttributes];
    updated[index] = { ...updated[index], [field]: val };
    setNewVehicleAttributes(updated);
  };

  const handleAddNewAttribute = () => {
    setNewVehicleAttributes([...newVehicleAttributes, { name: "", value: "" }]);
  };

  const handleRemoveNewAttribute = (index: number) => {
    setNewVehicleAttributes(newVehicleAttributes.filter((_, i) => i !== index));
  };

  // Drag and drop attribute reordering state & handlers (Edit Modal)
  const [draggedAttrIndex, setDraggedAttrIndex] = useState<number | null>(null);
  const [dragOverAttrIndex, setDragOverAttrIndex] = useState<number | null>(null);

  const handleAttrDragStart = (e: any, index: number) => {
    if (e?.dataTransfer) {
      e.dataTransfer.setData("text/plain", index.toString());
      e.dataTransfer.effectAllowed = "move";
    }
    setDraggedAttrIndex(index);
  };

  const handleAttrDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverAttrIndex !== index) {
      setDragOverAttrIndex(index);
    }
  };

  const handleAttrDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedAttrIndex === null || draggedAttrIndex === targetIndex) {
      setDraggedAttrIndex(null);
      setDragOverAttrIndex(null);
      return;
    }

    const updated = [...editingAttributes];
    const [moved] = updated.splice(draggedAttrIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setEditingAttributes(updated);

    setDraggedAttrIndex(null);
    setDragOverAttrIndex(null);
  };

  const handleAttrDragEnd = () => {
    setDraggedAttrIndex(null);
    setDragOverAttrIndex(null);
  };

  // Drag and drop attribute reordering state & handlers (Add Modal)
  const [draggedNewAttrIndex, setDraggedNewAttrIndex] = useState<number | null>(null);
  const [dragOverNewAttrIndex, setDragOverNewAttrIndex] = useState<number | null>(null);

  const handleNewAttrDragStart = (e: any, index: number) => {
    if (e?.dataTransfer) {
      e.dataTransfer.setData("text/plain", index.toString());
      e.dataTransfer.effectAllowed = "move";
    }
    setDraggedNewAttrIndex(index);
  };

  const handleNewAttrDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverNewAttrIndex !== index) {
      setDragOverNewAttrIndex(index);
    }
  };

  const handleNewAttrDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedNewAttrIndex === null || draggedNewAttrIndex === targetIndex) {
      setDraggedNewAttrIndex(null);
      setDragOverNewAttrIndex(null);
      return;
    }

    const updated = [...newVehicleAttributes];
    const [moved] = updated.splice(draggedNewAttrIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setNewVehicleAttributes(updated);

    setDraggedNewAttrIndex(null);
    setDragOverNewAttrIndex(null);
  };

  const handleNewAttrDragEnd = () => {
    setDraggedNewAttrIndex(null);
    setDragOverNewAttrIndex(null);
  };

  // Photo Gallery State & Handlers (Edit Modal)
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editingPhotos, setEditingPhotos] = useState<string[]>([]);
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null);
  const [dragOverPhotoIndex, setDragOverPhotoIndex] = useState<number | null>(null);
  const [isEditDropzoneActive, setIsEditDropzoneActive] = useState(false);

  // Photo Gallery State & Handlers (Add Modal)
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const [newVehiclePhotos, setNewVehiclePhotos] = useState<string[]>([]);
  const [draggedNewPhotoIndex, setDraggedNewPhotoIndex] = useState<number | null>(null);
  const [dragOverNewPhotoIndex, setDragOverNewPhotoIndex] = useState<number | null>(null);
  const [isAddDropzoneActive, setIsAddDropzoneActive] = useState(false);

  // Compress and optimize uploaded disk images for high performance & reliable storage
  const compressImage = (file: File, maxWidth = 1200, maxHeight = 900, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", quality));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Read and compress uploaded files into Data URLs
  const handleFilesUpload = (files: FileList | File[], isEdit: boolean) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    const promises = fileArray.map((file) => compressImage(file));

    Promise.all(promises).then((dataUrls) => {
      if (isEdit) {
        setEditingPhotos((prev) => [...prev, ...dataUrls]);
      } else {
        setNewVehiclePhotos((prev) => [...prev, ...dataUrls]);
      }
    });
  };

  // Reorder Photos Handlers (Edit Modal)
  const handlePhotoDragStart = (e: any, index: number) => {
    if (e?.dataTransfer) {
      e.dataTransfer.setData("text/plain", index.toString());
      e.dataTransfer.effectAllowed = "move";
    }
    setDraggedPhotoIndex(index);
  };

  const handlePhotoDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverPhotoIndex !== index) {
      setDragOverPhotoIndex(index);
    }
  };

  const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedPhotoIndex === null || draggedPhotoIndex === targetIndex) {
      setDraggedPhotoIndex(null);
      setDragOverPhotoIndex(null);
      return;
    }

    const updated = [...editingPhotos];
    const [moved] = updated.splice(draggedPhotoIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setEditingPhotos(updated);

    setDraggedPhotoIndex(null);
    setDragOverPhotoIndex(null);
  };

  const handlePhotoDragEnd = () => {
    setDraggedPhotoIndex(null);
    setDragOverPhotoIndex(null);
  };

  const handleRemovePhoto = (index: number) => {
    setEditingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Reorder Photos Handlers (Add Modal)
  const handleNewPhotoDragStart = (e: any, index: number) => {
    if (e?.dataTransfer) {
      e.dataTransfer.setData("text/plain", index.toString());
      e.dataTransfer.effectAllowed = "move";
    }
    setDraggedNewPhotoIndex(index);
  };

  const handleNewPhotoDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverNewPhotoIndex !== index) {
      setDragOverNewPhotoIndex(index);
    }
  };

  const handleNewPhotoDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedNewPhotoIndex === null || draggedNewPhotoIndex === targetIndex) {
      setDraggedNewPhotoIndex(null);
      setDragOverNewPhotoIndex(null);
      return;
    }

    const updated = [...newVehiclePhotos];
    const [moved] = updated.splice(draggedNewPhotoIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setNewVehiclePhotos(updated);

    setDraggedNewPhotoIndex(null);
    setDragOverNewPhotoIndex(null);
  };

  const handleNewPhotoDragEnd = () => {
    setDraggedNewPhotoIndex(null);
    setDragOverNewPhotoIndex(null);
  };

  const handleRemoveNewPhoto = (index: number) => {
    setNewVehiclePhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper preview arrays for real-time animated drag-and-drop gaps
  const getDisplayVehicles = () => {
    if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
      return filteredVehicles;
    }
    const result = [...filteredVehicles];
    const [moved] = result.splice(draggedIndex, 1);
    result.splice(dragOverIndex, 0, moved);
    return result;
  };

  const getDisplayEditPhotos = () => {
    if (draggedPhotoIndex === null || dragOverPhotoIndex === null || draggedPhotoIndex === dragOverPhotoIndex) {
      return editingPhotos;
    }
    const result = [...editingPhotos];
    const [moved] = result.splice(draggedPhotoIndex, 1);
    result.splice(dragOverPhotoIndex, 0, moved);
    return result;
  };

  const getDisplayNewPhotos = () => {
    if (draggedNewPhotoIndex === null || dragOverNewPhotoIndex === null || draggedNewPhotoIndex === dragOverNewPhotoIndex) {
      return newVehiclePhotos;
    }
    const result = [...newVehiclePhotos];
    const [moved] = result.splice(draggedNewPhotoIndex, 1);
    result.splice(dragOverNewPhotoIndex, 0, moved);
    return result;
  };

  const getDisplayEditAttributes = () => {
    if (draggedAttrIndex === null || dragOverAttrIndex === null || draggedAttrIndex === dragOverAttrIndex) {
      return editingAttributes;
    }
    const result = [...editingAttributes];
    const [moved] = result.splice(draggedAttrIndex, 1);
    result.splice(dragOverAttrIndex, 0, moved);
    return result;
  };

  const getDisplayNewAttributes = () => {
    if (draggedNewAttrIndex === null || dragOverNewAttrIndex === null || draggedNewAttrIndex === dragOverNewAttrIndex) {
      return newVehicleAttributes;
    }
    const result = [...newVehicleAttributes];
    const [moved] = result.splice(draggedNewAttrIndex, 1);
    result.splice(dragOverNewAttrIndex, 0, moved);
    return result;
  };

  // Lenient container-level drag-over handler for vertical lists (Vehicles & Attributes)
  const handleListContainerDragOver = (
    e: React.DragEvent<HTMLElement>,
    setOverIndex: (i: number) => void
  ) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";

    const container = e.currentTarget;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const y = e.clientY;
    let closestIndex = 0;
    let closestDistance = Infinity;

    children.forEach((child, idx) => {
      const rect = child.getBoundingClientRect();
      const childCenterY = rect.top + rect.height / 2;
      const dist = Math.abs(y - childCenterY);
      if (dist < closestDistance) {
        closestDistance = dist;
        closestIndex = idx;
      }
    });

    setOverIndex(closestIndex);
  };

  // Lenient container-level drag-over handler for 2D grids (Photo Gallery)
  const handleGridContainerDragOver = (
    e: React.DragEvent<HTMLElement>,
    setOverIndex: (i: number) => void
  ) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";

    const container = e.currentTarget;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const x = e.clientX;
    const y = e.clientY;
    let closestIndex = 0;
    let closestDistance = Infinity;

    children.forEach((child, idx) => {
      const rect = child.getBoundingClientRect();
      const childCenterX = rect.left + rect.width / 2;
      const childCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(x - childCenterX, y - childCenterY);
      if (dist < closestDistance) {
        closestDistance = dist;
        closestIndex = idx;
      }
    });

    setOverIndex(closestIndex);
  };

  // New Brand input state
  const [newBrandInput, setNewBrandInput] = useState("");

  // New vehicle form state
  const [newVehicleForm, setNewVehicleForm] = useState<{
    brand: string;
    model: string;
    type: "passenger" | "commercial" | "truck" | "machine";
    price: string;
    year: string;
    km: string;
    cc: string;
    fuel: string;
    image: string;
    isNewArrival: boolean;
    isPriceOnRequest: boolean;
  }>({
    brand: brands[0] || "Mercedes-Benz",
    model: "",
    type: "passenger",
    price: "",
    year: new Date().getFullYear().toString(),
    km: "",
    cc: "1461",
    fuel: "Πετρέλαιο",
    image: "",
    isNewArrival: true,
    isPriceOnRequest: false,
  });

  // Keep new vehicle default brand up to date
  useEffect(() => {
    if (brands.length > 0 && (!newVehicleForm.brand || !brands.includes(newVehicleForm.brand))) {
      setNewVehicleForm((prev) => ({ ...prev, brand: brands[0] }));
    }
  }, [brands]);

  // Session timer (30 minutes = 1800s)
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(1800);

  useEffect(() => {
    if (authStage !== "authenticated" || DEV_BYPASS_AUTH) return;
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

  // Clear errors on user input
  useEffect(() => {
    if (errorMessage) setErrorMessage("");
  }, [username, password, otpDigits]);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 1: Submit Password Form to trigger 2FA email
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await verifyAdminPasswordFn({
        data: { username: username.trim(), password },
      });

      if (!res.success) {
        setErrorMessage(res.error || "Invalid username or password.");
        setIsLoading(false);
        return;
      }

      setChallengeId(res.challengeId);
      setRecipientEmail(res.rawEmail || "whatdoesthejimsay.jj@gmail.com");

      if (res.emailSent) {
        setSuccessMessage("A 6-digit verification code has been sent via email.");
      } else {
        setSuccessMessage("2FA session started. (Check your email inbox or server console)");
      }

      setAuthStage("2fa");
      setOtpDigits(["", "", "", "", "", ""]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Authentication server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtpDigits(pastedData.split(""));
      otpInputRefs.current[5]?.focus();
    }
  };

  // Step 2: Verify 2FA OTP code
  const handle2faSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join("");

    if (fullCode.length < 6) {
      setErrorMessage("Please enter all 6 verification digits.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await verifyAdmin2FAFn({
        data: {
          challengeId,
          code: fullCode,
        },
      });

      if (!res.success) {
        setErrorMessage(res.error || "Incorrect 6-digit verification code.");
        setIsLoading(false);
        return;
      }

      setAuthStage("authenticated");
      setSessionTimeRemaining(1800);
      setErrorMessage("");
      triggerNotification("Welcome to Serroukas Cars Admin Control Center!");
    } catch (err: any) {
      console.error(err);
      setErrorMessage("2FA Verification error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await verifyAdminPasswordFn({
        data: { username: username.trim(), password },
      });
      if (res.success) {
        setChallengeId(res.challengeId);
        setSuccessMessage("A new verification code has been emailed.");
      } else {
        setErrorMessage("Failed to resend code. Please sign in again.");
      }
    } catch {
      setErrorMessage("Network error resending email code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Brand Management Handlers
  const handleAddBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandInput.trim()) return;

    const success = addBrand(newBrandInput.trim());
    if (success) {
      triggerNotification(`Added brand "${newBrandInput.trim()}" successfully.`);
      setNewBrandInput("");
    } else {
      triggerNotification(`Brand "${newBrandInput.trim()}" already exists.`);
    }
  };

  const handleRemoveBrand = (brandName: string) => {
    if (brands.length <= 1) {
      triggerNotification("At least one brand must remain.");
      return;
    }
    removeBrand(brandName);
    triggerNotification(`Removed brand "${brandName}".`);
  };

  // Add Vehicle handler
  const handleAddVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicleForm.model || !newVehicleForm.brand) return;

    const brandName = newVehicleForm.brand.trim();
    const modelName = newVehicleForm.model.trim();
    const numericPrice = newVehicleForm.isPriceOnRequest
      ? 0
      : Number(newVehicleForm.price.replace(/[^0-9]/g, "")) || 0;
    const numericYear = Number(newVehicleForm.year.replace(/[^0-9]/g, "")) || 2026;
    const numericKm = Number(newVehicleForm.km.replace(/[^0-9]/g, "")) || 0;
    const numericCc = Number(newVehicleForm.cc.replace(/[^0-9]/g, "")) || 1461;

    const newId = (1000 + Math.floor(Math.random() * 9000)).toString();

    let finalPhotoPaths = newVehiclePhotos;
    let savedDiskDir = "";
    try {
      const res = await saveVehiclePhotosToDiskFn({
        data: {
          vehicleId: newId,
          brand: brandName,
          model: modelName,
          price: numericPrice,
          photos: newVehiclePhotos,
        },
      });
      if (res.success && res.photoPaths.length > 0) {
        finalPhotoPaths = res.photoPaths;
        savedDiskDir = res.diskDirectory;
      }
    } catch (err) {
      console.warn("Could not save to disk server function, falling back to local store:", err);
    }

    const primaryImage =
      finalPhotoPaths.length > 0
        ? finalPhotoPaths[0]
        : newVehicleForm.image.trim() ||
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop";

    const created: Vehicle = {
      id: newId,
      code: newId,
      brand: brandName,
      model: modelName,
      type: newVehicleForm.type,
      price: numericPrice,
      year: numericYear,
      km: numericKm,
      cc: numericCc,
      fuel: newVehicleForm.fuel,
      image: primaryImage,
      images: finalPhotoPaths.length > 0 ? finalPhotoPaths : [primaryImage],
      badge: newVehicleForm.isNewArrival ? "ΝΕΑ ΑΦΙΞΗ" : null,
      attributes: newVehicleAttributes.filter((attr) => attr.name.trim() !== ""),
    };

    setVehicles([created, ...vehicles]);
    setIsAddModalOpen(false);
    setNewVehiclePhotos([]);
    setNewVehicleForm({
      brand: brands[0] || "Mercedes-Benz",
      model: "",
      type: "passenger",
      price: "",
      year: new Date().getFullYear().toString(),
      km: "",
      cc: "1461",
      fuel: "Πετρέλαιο",
      image: "",
      isNewArrival: true,
      isPriceOnRequest: false,
    });
    triggerNotification(`Added "${brandName} ${modelName}" and saved photos to ${savedDiskDir || "disk"}.`);
  };

  // Save Edit Vehicle handler
  const handleSaveEditVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    const rawVal = String(editingVehicle.price ?? 0);
    const numericPrice = Number(rawVal.replace(/[^0-9]/g, "")) || 0;

    let finalPhotoPaths = editingPhotos;
    let savedDiskDir = "";
    try {
      const res = await saveVehiclePhotosToDiskFn({
        data: {
          vehicleId: editingVehicle.id,
          brand: editingVehicle.brand,
          model: editingVehicle.model,
          price: numericPrice,
          photos: editingPhotos,
        },
      });
      if (res.success && res.photoPaths.length > 0) {
        finalPhotoPaths = res.photoPaths;
        savedDiskDir = res.diskDirectory;
      }
    } catch (err) {
      console.warn("Could not save to disk server function, falling back to local store:", err);
    }

    const primaryImage =
      finalPhotoPaths.length > 0
        ? finalPhotoPaths[0]
        : editingVehicle.image ||
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop";

    const updatedVehicle: Vehicle = {
      ...editingVehicle,
      price: numericPrice,
      image: primaryImage,
      images: finalPhotoPaths.length > 0 ? finalPhotoPaths : [primaryImage],
      attributes: editingAttributes.filter((attr) => attr.name.trim() !== ""),
    };

    setVehicles(vehicles.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v)));
    triggerNotification(`Updated "${updatedVehicle.brand} ${updatedVehicle.model}" and saved photos to ${savedDiskDir || "disk"}.`);
    setEditingVehicle(null);
  };

  // Delete Vehicle handler
  const confirmDeleteVehicle = (id: string) => {
    const target = vehicles.find((v) => v.id === id);
    setVehicles(vehicles.filter((v) => v.id !== id));
    setDeletingVehicleId(null);
    if (target) {
      triggerNotification(`Deleted "${target.brand} ${target.model}" from inventory.`);
    }
  };

  // Drag and Drop reordering handlers
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: any, index: number) => {
    if (e?.dataTransfer) {
      e.dataTransfer.setData("text/plain", index.toString());
      e.dataTransfer.effectAllowed = "move";
    }
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const draggedVehicle = filteredVehicles[draggedIndex];
    const targetVehicle = filteredVehicles[targetIndex];

    if (!draggedVehicle || !targetVehicle) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const fromIndex = vehicles.findIndex((v) => v.id === draggedVehicle.id);
    const toIndex = vehicles.findIndex((v) => v.id === targetVehicle.id);

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      const updated = [...vehicles];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      setVehicles(updated);
      triggerNotification(`Reordered "${draggedVehicle.brand} ${draggedVehicle.model}" to position ${toIndex + 1}.`);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Filtered Vehicle List
  const filteredVehicles = vehicles.filter((v) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      v.brand.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query) ||
      `${v.brand} ${v.model}`.toLowerCase().includes(query) ||
      v.id.toLowerCase().includes(query);
    const matchesCategory = categoryFilter === "all" || v.type === categoryFilter;
    const matchesBrand = selectedBrandFilter === "all" || v.brand.toLowerCase() === selectedBrandFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="min-h-dvh bg-background text-foreground selection:bg-primary selection:text-white relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none -z-10" />

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-emerald-500 text-black px-4 py-3 rounded-xl font-semibold shadow-2xl flex items-center gap-2.5 text-xs font-mono"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* AUTH STAGE 1 & 2: LOGIN & 2FA PORTAL                                     */}
      {/* ========================================================================= */}
      {authStage !== "authenticated" && (
        <div className="min-h-dvh flex flex-col justify-between">
          <header className="border-b border-white/10 bg-surface/40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="Serroukas Cars" className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
              <span className="font-display font-bold tracking-wider text-base text-white">SERROUKAS CARS</span>
            </Link>
            <Link to="/" className="text-xs font-medium text-muted-foreground hover:text-white transition-colors">
              Back to Showroom &rarr;
            </Link>
          </header>

          <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md">
              <div className="glass-strong rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {/* STEP 1: PASSWORD LOGIN */}
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
                        <h1 className="text-2xl font-bold font-display tracking-tight text-white">Admin Portal Login</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                          Sign in to generate your 2FA verification email.
                        </p>
                      </div>

                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                            Admin Username
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter admin username"
                            className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••••••"
                              className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono pr-10"
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

                        {errorMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
                          >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMessage}</span>
                          </motion.div>
                        )}

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn-hero btn-hero-hover w-full py-3.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 mt-2"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Authenticating & Sending Email Code...
                            </>
                          ) : (
                            <>
                              Sign In & Send 2FA Email Code
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {/* STEP 2: 2FA EMAIL VERIFICATION */}
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
                          <Mail className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl font-bold font-display tracking-tight text-white">Enter Verification Code</h1>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          A 6-digit verification code has been sent to your email address.
                        </p>
                      </div>

                      <form onSubmit={handle2faSubmit} className="space-y-5">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                              6-Digit Verification Code
                            </span>
                            <button
                              type="button"
                              onClick={handleResendCode}
                              disabled={isLoading}
                              className="text-[11px] text-amber-400 hover:underline font-mono disabled:opacity-50"
                            >
                              Resend Code
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                            {otpDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                ref={(el) => {
                                  otpInputRefs.current[idx] = el;
                                }}
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

                        {successMessage && (
                          <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                            <span>{successMessage}</span>
                          </div>
                        )}

                        {errorMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
                          >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMessage}</span>
                          </motion.div>
                        )}

                        <div className="space-y-2 pt-2">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                          >
                            {isLoading ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Verifying Code...
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4" />
                                Verify & Enter Admin Panel
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAuthStage("password");
                              setErrorMessage("");
                              setSuccessMessage("");
                            }}
                            className="w-full py-2.5 rounded-xl font-medium text-xs text-muted-foreground hover:text-white transition-colors"
                          >
                            &larr; Back to Login
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </main>

          <footer className="py-4 text-center text-xs text-muted-foreground border-t border-white/5 font-mono">
            Serroukas Cars &copy; {new Date().getFullYear()} — Inventory Control System
          </footer>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUTHENTICATED VEHICLE MANAGEMENT DASHBOARD                                */}
      {/* ========================================================================= */}
      {authStage === "authenticated" && (
        <div className="min-h-dvh flex flex-col bg-background">
          {/* Header Bar */}
          <header className="sticky top-0 z-40 border-b border-white/10 bg-surface/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <img src={logo} alt="Serroukas Cars Logo" className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-white text-base tracking-wide">SERROUKAS CARS</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/20 border border-primary/30 text-primary font-bold uppercase tracking-wider">
                      ADMIN CONTROL
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block -mt-0.5">Vehicle & Brand Control Center</span>
                </div>
              </Link>
            </div>

            {/* Header Controls: Session Timer & Logout */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Session: {formatTime(sessionTimeRemaining)}</span>
              </div>

              <button
                onClick={() => {
                  if (DEV_BYPASS_AUTH) {
                    triggerNotification("Dev mode active — Auth bypass enabled.");
                  } else {
                    setAuthStage("password");
                    setPassword("");
                    setOtpDigits(["", "", "", "", "", ""]);
                    triggerNotification("Logged out successfully.");
                  }
                }}
                className="glass-strong hover:bg-red-500/20 hover:border-red-500/30 text-xs px-3.5 py-1.5 rounded-xl font-medium text-red-400 border border-white/10 flex items-center gap-1.5 transition-all"
                title="Log out of admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* Main Dashboard Workspace */}
          <main className="flex-1 max-w-[1650px] w-full mx-auto p-6 sm:p-10 space-y-8">
            {/* Action Bar & Filtering */}
            <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-wide">Car Inventory & Showcase</h1>
                  <p className="text-sm text-muted-foreground mt-1">Manage car titles, brand categorizations, and vehicle specifications across the site.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsBrandModalOpen(true)}
                    className="glass-strong hover:bg-white/10 text-sm px-5 py-3 rounded-xl font-semibold flex items-center gap-2.5 border border-white/10 text-white transition-all font-mono shadow-md"
                  >
                    <Tag className="w-4 h-4 text-primary" /> Manage Brands
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-hero btn-hero-hover text-sm px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-xl shadow-primary/20"
                  >
                    <Plus className="w-5 h-5" /> Add New Car
                  </button>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-4 border-t border-white/10">
                <div className="sm:col-span-6 relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, brand, model, or ID..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary font-mono shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="sm:col-span-3 flex items-center gap-2.5">
                  <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono capitalize shadow-inner"
                  >
                    <option value="all">All Categories</option>
                    <option value="passenger">Passenger</option>
                    <option value="commercial">Commercial</option>
                    <option value="truck">Truck</option>
                    <option value="machine">Machinery</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                  <select
                    value={selectedBrandFilter}
                    onChange={(e) => setSelectedBrandFilter(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono capitalize shadow-inner"
                  >
                    <option value="all">All Brands ({brands.length})</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* INVENTORY DISPLAY: DESKTOP TABLE (xl:block) & SPLIT-SCREEN CARDS (xl:hidden) */}
            {/* ========================================================================= */}
            
            {/* 1. DESKTOP VIEW (>= 1280px) - Full-size original table */}
            <div className="hidden xl:block glass-strong rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/70 border-b border-white/10 font-mono text-muted-foreground uppercase text-xs">
                    <tr>
                      <th className="w-12 p-5 text-center"></th>
                      <th className="p-5">Car Image & Details</th>
                      <th className="p-5">Brand Category</th>
                      <th className="p-5">Category</th>
                      <th className="p-5">Year & Mileage</th>
                      <th className="p-5">Price</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody
                    onDragOver={(e) => {
                      if (draggedIndex !== null) {
                        handleListContainerDragOver(e, (idx) => {
                          if (dragOverIndex !== idx) setDragOverIndex(idx);
                        });
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedIndex !== null && dragOverIndex !== null) {
                        handleDrop(e, dragOverIndex);
                      }
                    }}
                    className="divide-y divide-white/5 font-medium"
                  >
                    {filteredVehicles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-16 text-center text-muted-foreground font-mono text-base">
                          No vehicles match your current search/filter criteria.
                        </td>
                      </tr>
                    ) : (
                      getDisplayVehicles().map((v, index) => {
                        const originalIndex = filteredVehicles.findIndex((fv) => fv.id === v.id);
                        const isOriginalDragged = draggedIndex !== null && filteredVehicles[draggedIndex]?.id === v.id;
                        const isTargetGap = draggedIndex !== null && dragOverIndex !== null && index === dragOverIndex;

                        return (
                          <motion.tr
                            layout
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            key={v.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, originalIndex >= 0 ? originalIndex : index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`transition-all group ${
                              isOriginalDragged
                                ? "opacity-30 bg-primary/20 border-y-2 border-dashed border-primary scale-[0.99]"
                                : isTargetGap
                                ? "bg-primary/20 border-y-2 border-primary shadow-xl"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <td className="p-5 text-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-white" title="Drag to reorder vehicle showcase position">
                              <GripVertical className="w-5 h-5 mx-auto" />
                            </td>
                            <td className="p-5">
                              <div className="flex items-center gap-4">
                                <img
                                  src={v.image}
                                  alt={`${v.brand} ${v.model}`}
                                  className="w-24 h-16 object-contain rounded-xl border border-white/15 shrink-0 bg-black/60 shadow-md"
                                />
                                <div>
                                  <div className="font-bold text-white text-base group-hover:text-primary transition-colors flex items-center gap-2.5">
                                    <span>{v.brand} {v.model}</span>
                                    {v.badge === "ΝΕΑ ΑΦΙΞΗ" && (
                                      <span className="px-2.5 py-0.5 rounded-full btn-hero text-[10px] font-mono font-bold tracking-wider shadow-sm whitespace-nowrap">
                                        ΝΕΑ ΑΦΙΞΗ
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground font-mono flex items-center gap-2 mt-0.5">
                                    <span>ID: {v.id}</span>
                                    <span>•</span>
                                    <span>{v.fuel}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 whitespace-nowrap">
                              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider">
                                <Tag className="w-3.5 h-3.5 text-zinc-400" />
                                {v.brand}
                              </span>
                            </td>
                            <td className="p-5 whitespace-nowrap">
                              <span className="capitalize px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground font-mono text-xs">
                                {v.type}
                              </span>
                            </td>
                            <td className="p-5 font-mono text-muted-foreground whitespace-nowrap">
                              <div className="text-white font-semibold text-sm">{v.year}</div>
                              <div className="text-xs">{typeof v.km === "number" ? `${v.km.toLocaleString()} km` : v.km}</div>
                            </td>
                            <td className="p-5 font-bold font-mono text-white text-base whitespace-nowrap">
                              {typeof v.price === "number" ? (v.price > 0 ? `€${v.price.toLocaleString()}` : "Κατόπιν Ραντεβού") : (v.price === "0" || v.price === "Κατόπιν Ραντεβού" ? "Κατόπιν Ραντεβού" : v.price)}
                            </td>
                            <td className="p-5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingVehicle({ ...v });
                                    setIsEditingPriceOnRequest(typeof v.price === "number" ? v.price <= 0 : String(v.price) === "0" || String(v.price) === "Κατόπιν Ραντεβού");
                                    setEditingAttributes(getDefaultVehicleAttributes(v));
                                    const photos = v.images && v.images.length > 0 ? v.images : v.image ? [v.image] : [];
                                    setEditingPhotos(photos);
                                  }}
                                  className="p-2.5 rounded-xl bg-white/5 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all border border-white/10"
                                  title="Edit vehicle details"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingVehicleId(v.id)}
                                  className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all border border-white/10"
                                  title="Delete vehicle"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. SPLIT-SCREEN / RESPONSIVE VIEW (< 1280px) - Self-contained car bubbles */}
            <div
              onDragOver={(e) => {
                if (draggedIndex !== null) {
                  handleListContainerDragOver(e, (idx) => {
                    if (dragOverIndex !== idx) setDragOverIndex(idx);
                  });
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedIndex !== null && dragOverIndex !== null) {
                  handleDrop(e, dragOverIndex);
                }
              }}
              className="block xl:hidden space-y-4"
            >
              {filteredVehicles.length === 0 ? (
                <div className="glass-strong rounded-3xl p-12 text-center text-muted-foreground font-mono text-sm border border-white/10 shadow-xl">
                  No vehicles match your current search/filter criteria.
                </div>
              ) : (
                getDisplayVehicles().map((v, index) => {
                  const originalIndex = filteredVehicles.findIndex((fv) => fv.id === v.id);
                  const isOriginalDragged = draggedIndex !== null && filteredVehicles[draggedIndex]?.id === v.id;
                  const isTargetGap = draggedIndex !== null && dragOverIndex !== null && index === dragOverIndex;

                  return (
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      key={v.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, originalIndex >= 0 ? originalIndex : index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`glass-strong rounded-3xl p-5 border shadow-xl transition-all space-y-4 ${
                        isOriginalDragged
                          ? "opacity-30 bg-primary/20 border-2 border-dashed border-primary scale-[0.98]"
                          : isTargetGap
                          ? "bg-primary/20 border-2 border-primary shadow-2xl scale-[1.01]"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      {/* Header: Drag Handle + Thumbnail + Car Details + Badges */}
                      <div className="flex items-start gap-3">
                        <div
                          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-white p-1 mt-1 shrink-0"
                          title="Drag to reorder vehicle position"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>

                        <img
                          src={v.image}
                          alt={`${v.brand} ${v.model}`}
                          className="w-20 h-14 object-contain rounded-xl border border-white/15 shrink-0 bg-black/60 shadow-md"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-white text-base leading-tight truncate">
                              {v.brand} {v.model}
                            </h3>
                            {v.badge === "ΝΕΑ ΑΦΙΞΗ" && (
                              <span className="px-2.5 py-0.5 rounded-full btn-hero text-[10px] font-mono font-bold tracking-wider shadow-sm shrink-0">
                                ΝΕΑ ΑΦΙΞΗ
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground font-mono flex items-center gap-2 mt-1">
                            <span>ID: {v.id}</span>
                            <span>•</span>
                            <span>{v.fuel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Meta Info Bar: Brand, Category, Year & KM */}
                      <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-white/5 text-xs font-mono">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 font-bold uppercase">
                          <Tag className="w-3.5 h-3.5 text-zinc-400" />
                          {v.brand}
                        </span>
                        <span className="capitalize px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-muted-foreground">
                          {v.type}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-white font-medium">
                          {v.year} • {typeof v.km === "number" ? `${v.km.toLocaleString()} km` : v.km}
                        </span>
                      </div>

                      {/* Footer: Price + Actions (Edit & Delete Buttons) */}
                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/10">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
                            Price
                          </span>
                          <span className="font-bold font-mono text-white text-lg">
                            {typeof v.price === "number" ? (v.price > 0 ? `€${v.price.toLocaleString()}` : "Κατόπιν Ραντεβού") : (v.price === "0" || v.price === "Κατόπιν Ραντεβού" ? "Κατόπιν Ραντεβού" : v.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingVehicle({ ...v });
                              setIsEditingPriceOnRequest(typeof v.price === "number" ? v.price <= 0 : String(v.price) === "0" || String(v.price) === "Κατόπιν Ραντεβού");
                              setEditingAttributes(getDefaultVehicleAttributes(v));
                              const photos = v.images && v.images.length > 0 ? v.images : v.image ? [v.image] : [];
                              setEditingPhotos(photos);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all border border-white/10 text-xs font-mono font-semibold flex items-center gap-1.5"
                            title="Edit vehicle details"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeletingVehicleId(v.id)}
                            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all border border-white/10 text-xs font-mono font-semibold flex items-center gap-1.5"
                            title="Delete vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW CAR                                                      */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-3xl p-8 sm:p-10 max-w-6xl w-full border border-white/20 shadow-2xl relative max-h-[94vh] flex flex-col my-auto"
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b border-white/10 shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0 shadow-lg">
                <Plus className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-white tracking-wide">Add New Car</h2>
                <p className="text-sm text-muted-foreground font-mono mt-0.5">Fill in car details & specification attributes to publish to inventory.</p>
              </div>
            </div>

            <form onSubmit={handleAddVehicleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Left Column: Core Car Details */}
                <div className="space-y-5">
                  <h3 className="text-sm font-mono font-bold uppercase text-primary tracking-wider border-b border-white/10 pb-2.5">
                    Core Vehicle Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">
                        Brand Category <span className="text-primary">*</span>
                      </label>
                      <select
                        value={newVehicleForm.brand}
                        onChange={(e) => setNewVehicleForm({ ...newVehicleForm, brand: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono"
                        required
                      >
                        {brands.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">
                        Car Title / Model <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. A180 AMG Line"
                        value={newVehicleForm.model}
                        onChange={(e) => setNewVehicleForm({ ...newVehicleForm, model: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">Category</label>
                      <select
                        value={newVehicleForm.type}
                        onChange={(e) => setNewVehicleForm({ ...newVehicleForm, type: e.target.value as any })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono capitalize"
                      >
                        <option value="passenger">Passenger</option>
                        <option value="commercial">Commercial</option>
                        <option value="truck">Truck</option>
                        <option value="machine">Machinery</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-mono text-muted-foreground uppercase font-bold tracking-wider">Price (€)</label>
                        <label htmlFor="priceOnRequestAdd" className="flex items-center gap-1.5 text-xs font-mono text-amber-400 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="priceOnRequestAdd"
                            checked={newVehicleForm.isPriceOnRequest}
                            onChange={(e) => setNewVehicleForm({ ...newVehicleForm, isPriceOnRequest: e.target.checked })}
                            className="w-4 h-4 rounded border-white/20 bg-black/50 accent-amber-500 cursor-pointer"
                          />
                          <span className="font-bold">Κατόπιν Ραντεβού</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        required={!newVehicleForm.isPriceOnRequest}
                        disabled={newVehicleForm.isPriceOnRequest}
                        placeholder={newVehicleForm.isPriceOnRequest ? "Κατόπιν Ραντεβού" : "e.g. 24900"}
                        value={newVehicleForm.isPriceOnRequest ? "Κατόπιν Ραντεβού" : newVehicleForm.price}
                        onChange={(e) => setNewVehicleForm({ ...newVehicleForm, price: e.target.value })}
                        className={`w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary font-mono ${
                          newVehicleForm.isPriceOnRequest ? "opacity-75 bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">Year</label>
                      <input
                        type="text"
                        required
                        value={newVehicleForm.year}
                        onChange={(e) => setNewVehicleForm({ ...newVehicleForm, year: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">Mileage (KM)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 120000"
                        value={newVehicleForm.km}
                        onChange={(e) => setNewVehicleForm({ ...newVehicleForm, km: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">Fuel</label>
                      <select
                        value={newVehicleForm.fuel}
                        onChange={(e) => setNewVehicleForm({ ...newVehicleForm, fuel: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono"
                      >
                        <option value="Πετρέλαιο">Πετρέλαιο (Diesel)</option>
                        <option value="Βενζίνη">Βενζίνη (Petrol)</option>
                        <option value="Υβριδικό">Υβριδικό (Hybrid)</option>
                        <option value="Ηλεκτρικό">Ηλεκτρικό (Electric)</option>
                      </select>
                    </div>
                  </div>

                  {/* New Arrival Badge Checkbox */}
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <input
                      type="checkbox"
                      id="newArrivalAdd"
                      checked={newVehicleForm.isNewArrival}
                      onChange={(e) => setNewVehicleForm({ ...newVehicleForm, isNewArrival: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-black/50 text-primary focus:ring-primary accent-red-600 cursor-pointer"
                    />
                    <label htmlFor="newArrivalAdd" className="text-sm font-mono text-white cursor-pointer select-none flex items-center gap-2">
                      <span className="font-bold">Mark as "ΝΕΑ ΑΦΙΞΗ" (New Arrival)</span>
                      <span className="text-xs text-muted-foreground">(Badge on showcase card)</span>
                    </label>
                  </div>

                  {/* Interactive Photo Upload & Drag-and-Drop Gallery Manager */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono text-muted-foreground uppercase font-bold tracking-wider">
                        Vehicle Photo Gallery ({newVehiclePhotos.length} photos)
                      </label>
                      <span className="text-xs font-mono text-muted-foreground">
                        1st photo is automatic cover image
                      </span>
                    </div>

                    {/* Dropzone Box */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsAddDropzoneActive(true);
                      }}
                      onDragLeave={() => setIsAddDropzoneActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsAddDropzoneActive(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          handleFilesUpload(e.dataTransfer.files, false);
                        }
                      }}
                      onClick={() => addFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                        isAddDropzoneActive
                          ? "border-primary bg-primary/20 scale-[1.01]"
                          : "border-white/20 hover:border-primary/50 bg-black/50 hover:bg-white/5"
                      }`}
                    >
                      <input
                        ref={addFileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleFilesUpload(e.target.files, false);
                          }
                        }}
                        className="hidden"
                      />
                      <UploadCloud className="w-10 h-10 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-mono font-bold text-white">Drag & drop car photos here or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">Upload multiple photos from your disk</p>
                    </div>

                    {/* Thumbnail Gallery with Drag and Drop Reordering */}
                    {newVehiclePhotos.length > 0 && (
                      <div
                        onDragOver={(e) => {
                          if (draggedNewPhotoIndex !== null) {
                            handleGridContainerDragOver(e, (idx) => {
                              if (dragOverNewPhotoIndex !== idx) setDragOverNewPhotoIndex(idx);
                            });
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedNewPhotoIndex !== null && dragOverNewPhotoIndex !== null) {
                            handleNewPhotoDrop(e, dragOverNewPhotoIndex);
                          }
                        }}
                        className="grid grid-cols-3 sm:grid-cols-4 gap-3"
                      >
                        {getDisplayNewPhotos().map((photoUrl, idx) => {
                          const originalIdx = newVehiclePhotos.indexOf(photoUrl);
                          const isOriginalDragged = draggedNewPhotoIndex !== null && newVehiclePhotos[draggedNewPhotoIndex] === photoUrl;
                          const isTargetGap = draggedNewPhotoIndex !== null && dragOverNewPhotoIndex !== null && idx === dragOverNewPhotoIndex;

                          return (
                            <motion.div
                              layout
                              transition={{ type: "spring", stiffness: 350, damping: 25 }}
                              key={`new-photo-${photoUrl.slice(0, 40)}-${idx}`}
                              draggable
                              onDragStart={(e) => handleNewPhotoDragStart(e, originalIdx >= 0 ? originalIdx : idx)}
                              onDragOver={(e) => handleNewPhotoDragOver(e, idx)}
                              onDrop={(e) => handleNewPhotoDrop(e, idx)}
                              onDragEnd={handleNewPhotoDragEnd}
                              className={`relative group aspect-[4/3] rounded-xl overflow-hidden border transition-all bg-black/40 ${
                                isOriginalDragged
                                  ? "opacity-30 border-2 border-dashed border-primary scale-95"
                                  : isTargetGap
                                  ? "border-2 border-primary shadow-lg scale-105"
                                  : "border-white/10 hover:border-white/30"
                              }`}
                            >
                              <img src={photoUrl} alt={`Car Photo ${idx + 1}`} className="w-full h-full object-contain bg-black" />
                              {idx === 0 && (
                                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-primary text-black font-mono font-bold text-[10px] uppercase shadow-md">
                                  Cover
                                </span>
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <div className="cursor-grab active:cursor-grabbing p-2 rounded-xl bg-white/20 text-white hover:bg-white/30" title="Drag to reorder photo position">
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNewPhoto(originalIdx >= 0 ? originalIdx : idx)}
                                  className="p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                                  title="Delete photo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Dynamic Specifications Table Manager */}
                <div className="space-y-5 flex flex-col">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div>
                      <h3 className="text-sm font-mono font-bold uppercase text-primary tracking-wider">
                        Specifications & Attributes Table
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Add, edit, or remove key-value specs displayed on the car page.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddNewAttribute}
                      className="px-4 py-2 rounded-xl bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Attribute
                    </button>
                  </div>

                  <div
                    onDragOver={(e) => {
                      if (draggedNewAttrIndex !== null) {
                        handleListContainerDragOver(e, (idx) => {
                          if (dragOverNewAttrIndex !== idx) setDragOverNewAttrIndex(idx);
                        });
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedNewAttrIndex !== null && dragOverNewAttrIndex !== null) {
                        handleNewAttrDrop(e, dragOverNewAttrIndex);
                      }
                    }}
                    className="space-y-3 flex-1"
                  >
                    {getDisplayNewAttributes().map((attr, idx) => {
                      const originalIdx = newVehicleAttributes.indexOf(attr);
                      const isOriginalDragged = draggedNewAttrIndex !== null && newVehicleAttributes[draggedNewAttrIndex] === attr;
                      const isTargetGap = draggedNewAttrIndex !== null && dragOverNewAttrIndex !== null && idx === dragOverNewAttrIndex;

                      return (
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          key={attr.name ? `new-attr-${attr.name}-${idx}` : `new-attr-${idx}`}
                          draggable
                          onDragStart={(e) => handleNewAttrDragStart(e, originalIdx >= 0 ? originalIdx : idx)}
                          onDragOver={(e) => handleNewAttrDragOver(e, idx)}
                          onDrop={(e) => handleNewAttrDrop(e, idx)}
                          onDragEnd={handleNewAttrDragEnd}
                          className={`flex items-center gap-2.5 rounded-2xl p-3 transition-all ${
                            isOriginalDragged
                              ? "opacity-30 bg-primary/20 border-2 border-dashed border-primary scale-[0.98]"
                              : isTargetGap
                              ? "bg-primary/20 border-2 border-primary shadow-lg scale-[1.01]"
                              : "bg-white/5 border border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div
                            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-white p-1 shrink-0"
                            title="Drag to reorder attribute"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            placeholder="Attribute Name (e.g. Σασμάν)"
                            value={attr.name}
                            onChange={(e) => handleNewAttributeChange(originalIdx >= 0 ? originalIdx : idx, "name", e.target.value)}
                            className="w-1/2 bg-black/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary font-mono"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. Αυτόματο)"
                            value={attr.value}
                            onChange={(e) => handleNewAttributeChange(originalIdx >= 0 ? originalIdx : idx, "value", e.target.value)}
                            className="w-1/2 bg-black/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewAttribute(originalIdx >= 0 ? originalIdx : idx)}
                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors shrink-0"
                            title="Remove attribute"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-5 flex items-center justify-end gap-4 border-t border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 rounded-xl text-sm font-mono font-semibold text-muted-foreground hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-hero btn-hero-hover px-7 py-3 rounded-xl text-sm font-mono font-bold flex items-center gap-2.5 shadow-xl"
                >
                  <Plus className="w-5 h-5" /> Save & Add Car
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT VEHICLE INFO                                                */}
      {/* ========================================================================= */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-3xl p-8 sm:p-10 max-w-6xl w-full border border-white/20 shadow-2xl relative max-h-[94vh] flex flex-col my-auto"
          >
            <button
              onClick={() => setEditingVehicle(null)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b border-white/10 shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0 shadow-lg">
                <Edit3 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-white tracking-wide">Edit Vehicle Details</h2>
                <div className="flex items-center gap-2.5 text-sm font-mono text-muted-foreground mt-0.5">
                  <span>Vehicle ID: <strong className="text-white">{editingVehicle.id}</strong></span>
                  <span>•</span>
                  <span>{editingVehicle.brand} {editingVehicle.model}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveEditVehicle} className="flex-1 overflow-y-auto pr-2 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Left Column: Core Car Details */}
                <div className="space-y-5">
                  <h3 className="text-sm font-mono font-bold uppercase text-primary tracking-wider border-b border-white/10 pb-2.5">
                    Core Vehicle Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">
                        Brand Category <span className="text-primary">*</span>
                      </label>
                      <select
                        value={editingVehicle.brand}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, brand: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono"
                        required
                      >
                        {brands.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">
                        Car Model / Title <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingVehicle.model}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">Category</label>
                      <select
                        value={editingVehicle.type}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, type: e.target.value as any })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono capitalize"
                      >
                        <option value="passenger">Passenger</option>
                        <option value="commercial">Commercial</option>
                        <option value="truck">Truck</option>
                        <option value="machine">Machinery</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-mono text-muted-foreground uppercase font-bold tracking-wider">Price (€)</label>
                        <label htmlFor="priceOnRequestEdit" className="flex items-center gap-1.5 text-xs font-mono text-amber-400 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="priceOnRequestEdit"
                            checked={isEditingPriceOnRequest}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setIsEditingPriceOnRequest(checked);
                              setEditingVehicle({ ...editingVehicle, price: 0 });
                            }}
                            className="w-4 h-4 rounded border-white/20 bg-black/50 accent-amber-500 cursor-pointer"
                          />
                          <span className="font-bold">Κατόπιν Ραντεβού</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        disabled={isEditingPriceOnRequest}
                        placeholder={isEditingPriceOnRequest ? "Κατόπιν Ραντεβού" : "0"}
                        value={isEditingPriceOnRequest ? "Κατόπιν Ραντεβού" : editingVehicle.price}
                        onChange={(e) => {
                          const val = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
                          setEditingVehicle({ ...editingVehicle, price: val });
                        }}
                        className={`w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono ${
                          isEditingPriceOnRequest ? "opacity-75 bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">Year</label>
                      <input
                        type="text"
                        required
                        value={editingVehicle.year}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, year: Number(e.target.value) || 2026 })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">Mileage (KM)</label>
                      <input
                        type="text"
                        required
                        value={editingVehicle.km}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, km: Number(e.target.value) || 0 })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase font-bold tracking-wider">Fuel</label>
                      <input
                        type="text"
                        required
                        value={editingVehicle.fuel}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, fuel: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>

                  {/* New Arrival Badge Checkbox */}
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <input
                      type="checkbox"
                      id="newArrivalEdit"
                      checked={editingVehicle.badge === "ΝΕΑ ΑΦΙΞΗ"}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, badge: e.target.checked ? "ΝΕΑ ΑΦΙΞΗ" : null })}
                      className="w-5 h-5 rounded border-white/20 bg-black/50 text-primary focus:ring-primary accent-red-600 cursor-pointer"
                    />
                    <label htmlFor="newArrivalEdit" className="text-sm font-mono text-white cursor-pointer select-none flex items-center gap-2">
                      <span className="font-bold">Mark as "ΝΕΑ ΑΦΙΞΗ" (New Arrival)</span>
                      <span className="text-xs text-muted-foreground">(Badge on showcase card)</span>
                    </label>
                  </div>

                  {/* Interactive Photo Upload & Drag-and-Drop Gallery Manager */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono text-muted-foreground uppercase font-bold tracking-wider">
                        Vehicle Photo Gallery ({editingPhotos.length} photos)
                      </label>
                      <span className="text-xs font-mono text-muted-foreground">
                        1st photo is automatic cover image
                      </span>
                    </div>

                    {/* Dropzone Box */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsEditDropzoneActive(true);
                      }}
                      onDragLeave={() => setIsEditDropzoneActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsEditDropzoneActive(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          handleFilesUpload(e.dataTransfer.files, true);
                        }
                      }}
                      onClick={() => editFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                        isEditDropzoneActive
                          ? "border-primary bg-primary/20 scale-[1.01]"
                          : "border-white/20 hover:border-primary/50 bg-black/50 hover:bg-white/5"
                      }`}
                    >
                      <input
                        ref={editFileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleFilesUpload(e.target.files, true);
                          }
                        }}
                        className="hidden"
                      />
                      <UploadCloud className="w-10 h-10 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-mono font-bold text-white">Drag & drop car photos here or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">Upload multiple photos from your disk</p>
                    </div>

                    {/* Thumbnail Gallery with Drag and Drop Reordering */}
                    {editingPhotos.length > 0 && (
                      <div
                        onDragOver={(e) => {
                          if (draggedPhotoIndex !== null) {
                            handleGridContainerDragOver(e, (idx) => {
                              if (dragOverPhotoIndex !== idx) setDragOverPhotoIndex(idx);
                            });
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedPhotoIndex !== null && dragOverPhotoIndex !== null) {
                            handlePhotoDrop(e, dragOverPhotoIndex);
                          }
                        }}
                        className="grid grid-cols-3 sm:grid-cols-4 gap-3"
                      >
                        {getDisplayEditPhotos().map((photoUrl, idx) => {
                          const originalIdx = editingPhotos.indexOf(photoUrl);
                          const isOriginalDragged = draggedPhotoIndex !== null && editingPhotos[draggedPhotoIndex] === photoUrl;
                          const isTargetGap = draggedPhotoIndex !== null && dragOverPhotoIndex !== null && idx === dragOverPhotoIndex;

                          return (
                            <motion.div
                              layout
                              transition={{ type: "spring", stiffness: 350, damping: 25 }}
                              key={`edit-photo-${photoUrl.slice(0, 40)}-${idx}`}
                              draggable
                              onDragStart={(e) => handlePhotoDragStart(e, originalIdx >= 0 ? originalIdx : idx)}
                              onDragOver={(e) => handlePhotoDragOver(e, idx)}
                              onDrop={(e) => handlePhotoDrop(e, idx)}
                              onDragEnd={handlePhotoDragEnd}
                              className={`relative group aspect-[4/3] rounded-xl overflow-hidden border transition-all bg-black/40 ${
                                isOriginalDragged
                                  ? "opacity-30 border-2 border-dashed border-primary scale-95"
                                  : isTargetGap
                                  ? "border-2 border-primary shadow-lg scale-105"
                                  : "border-white/10 hover:border-white/30"
                              }`}
                            >
                              <img src={photoUrl} alt={`Car Photo ${idx + 1}`} className="w-full h-full object-contain bg-black" />
                              {idx === 0 && (
                                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-primary text-black font-mono font-bold text-[10px] uppercase shadow-md">
                                  Cover
                                </span>
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <div className="cursor-grab active:cursor-grabbing p-2 rounded-xl bg-white/20 text-white hover:bg-white/30" title="Drag to reorder photo position">
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(originalIdx >= 0 ? originalIdx : idx)}
                                  className="p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                                  title="Delete photo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Dynamic Specifications Table Manager */}
                <div className="space-y-5 flex flex-col">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div>
                      <h3 className="text-sm font-mono font-bold uppercase text-primary tracking-wider">
                        Specifications & Attributes Table
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Add, edit, or remove key-value specs displayed on the car page.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAttribute}
                      className="px-4 py-2 rounded-xl bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Attribute
                    </button>
                  </div>

                  <div
                    onDragOver={(e) => {
                      if (draggedAttrIndex !== null) {
                        handleListContainerDragOver(e, (idx) => {
                          if (dragOverAttrIndex !== idx) setDragOverAttrIndex(idx);
                        });
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedAttrIndex !== null && dragOverAttrIndex !== null) {
                        handleAttrDrop(e, dragOverAttrIndex);
                      }
                    }}
                    className="space-y-3 flex-1"
                  >
                    {getDisplayEditAttributes().map((attr, idx) => {
                      const originalIdx = editingAttributes.indexOf(attr);
                      const isOriginalDragged = draggedAttrIndex !== null && editingAttributes[draggedAttrIndex] === attr;
                      const isTargetGap = draggedAttrIndex !== null && dragOverAttrIndex !== null && idx === dragOverAttrIndex;

                      return (
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          key={attr.name ? `edit-attr-${attr.name}-${idx}` : `edit-attr-${idx}`}
                          draggable
                          onDragStart={(e) => handleAttrDragStart(e, originalIdx >= 0 ? originalIdx : idx)}
                          onDragOver={(e) => handleAttrDragOver(e, idx)}
                          onDrop={(e) => handleAttrDrop(e, idx)}
                          onDragEnd={handleAttrDragEnd}
                          className={`flex items-center gap-2.5 rounded-2xl p-3 transition-all ${
                            isOriginalDragged
                              ? "opacity-30 bg-primary/20 border-2 border-dashed border-primary scale-[0.98]"
                              : isTargetGap
                              ? "bg-primary/20 border-2 border-primary shadow-lg scale-[1.01]"
                              : "bg-white/5 border border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div
                            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-white p-1 shrink-0"
                            title="Drag to reorder attribute"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            placeholder="Attribute Name (e.g. Σασμάν)"
                            value={attr.name}
                            onChange={(e) => handleAttributeChange(originalIdx >= 0 ? originalIdx : idx, "name", e.target.value)}
                            className="w-1/2 bg-black/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary font-mono"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. Αυτόματο)"
                            value={attr.value}
                            onChange={(e) => handleAttributeChange(originalIdx >= 0 ? originalIdx : idx, "value", e.target.value)}
                            className="w-1/2 bg-black/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveAttribute(originalIdx >= 0 ? originalIdx : idx)}
                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors shrink-0"
                            title="Remove attribute"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-5 flex items-center justify-end gap-4 border-t border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-6 py-3 rounded-xl text-sm font-mono font-semibold text-muted-foreground hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-hero btn-hero-hover px-7 py-3 rounded-xl text-sm font-mono font-bold flex items-center gap-2.5 shadow-xl"
                >
                  <Check className="w-5 h-5" /> Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BRAND MANAGEMENT                                                */}
      {/* ========================================================================= */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl relative space-y-6"
          >
            <button
              onClick={() => setIsBrandModalOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3.5 pb-2 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0 shadow-lg">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-white tracking-wide">Manage Brands</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Add or remove car brand categories displayed on the site.</p>
              </div>
            </div>

            {/* Add Brand Form */}
            <form onSubmit={handleAddBrandSubmit} className="flex items-center gap-3">
              <input
                type="text"
                required
                placeholder="Enter new brand name (e.g. BMW, Porsche)"
                value={newBrandInput}
                onChange={(e) => setNewBrandInput(e.target.value)}
                className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary font-mono shadow-inner"
              />
              <button
                type="submit"
                className="btn-hero btn-hero-hover px-5 py-3 rounded-xl text-sm font-mono font-bold flex items-center gap-2 shrink-0 shadow-lg"
              >
                <Plus className="w-4 h-4" /> Add Brand
              </button>
            </form>

            {/* Active Brands Pills */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-muted-foreground block">
                Active Brands ({brands.length})
              </span>
              <div className="flex flex-wrap gap-2.5 p-1">
                {brands.map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono font-medium group hover:border-primary/40 transition-colors shadow-sm"
                  >
                    <Tag className="w-4 h-4 text-primary" />
                    <span>{b}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBrand(b)}
                      className="text-muted-foreground hover:text-red-400 transition-colors ml-1 p-1 rounded-lg hover:bg-white/10"
                      title={`Remove brand ${b}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-white/10">
              <button
                onClick={() => setIsBrandModalOpen(false)}
                className="btn-hero btn-hero-hover px-6 py-2.5 rounded-xl text-sm font-mono font-bold shadow-lg"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DELETE CONFIRMATION                                              */}
      {/* ========================================================================= */}
      {deletingVehicleId && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-3xl p-7 max-w-md w-full border border-red-500/30 shadow-2xl relative text-center space-y-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-lg">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">Delete Vehicle Listing?</h3>
              <p className="text-sm text-muted-foreground mt-1.5">
                Are you sure you want to remove this vehicle from your inventory? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingVehicleId(null)}
                className="w-1/2 py-3 rounded-xl text-sm font-mono font-semibold text-muted-foreground hover:text-white bg-white/5 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteVehicle(deletingVehicleId)}
                className="w-1/2 py-3 rounded-xl text-sm font-mono font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Delete Car
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
