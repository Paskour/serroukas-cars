import { useState, useEffect } from "react";
import { vehicles as initialCatalogVehicles, brands as initialBrandObjects, Vehicle } from "@/lib/vehicles";

const VEHICLES_STORAGE_KEY = "serroukas_vehicles_store_v1";
const BRANDS_STORAGE_KEY = "serroukas_brands_store_v1";
const STORE_UPDATE_EVENT = "serroukas_store_update";

// Initial default brands from catalog
const defaultBrandNames: string[] = Array.from(
  new Set([
    ...initialBrandObjects.map((b) => b.name),
    ...initialCatalogVehicles.map((v) => v.brand).filter(Boolean),
  ])
);

// Helper: Read stored vehicles or fallback to catalog
export function getStoredVehicles(): Vehicle[] {
  if (typeof window === "undefined") return initialCatalogVehicles;
  try {
    const raw = localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(initialCatalogVehicles));
      return initialCatalogVehicles;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialCatalogVehicles;
  } catch {
    return initialCatalogVehicles;
  }
}

// Helper: Save vehicles to store
export function saveStoredVehicles(vehicles: Vehicle[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
    window.dispatchEvent(new Event(STORE_UPDATE_EVENT));
  } catch (err) {
    console.error("Failed to save vehicles to storage:", err);
  }
}

// Helper: Read stored brand names or fallback
export function getStoredBrands(): string[] {
  if (typeof window === "undefined") return defaultBrandNames;
  try {
    const raw = localStorage.getItem(BRANDS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(defaultBrandNames));
      return defaultBrandNames;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultBrandNames;
  } catch {
    return defaultBrandNames;
  }
}

// Helper: Save brand names to store
export function saveStoredBrands(brands: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(brands));
    window.dispatchEvent(new Event(STORE_UPDATE_EVENT));
  } catch (err) {
    console.error("Failed to save brands to storage:", err);
  }
}

// Custom React Hook for Reactive Vehicles Store
export function useVehiclesStore(): [Vehicle[], (updater: Vehicle[] | ((prev: Vehicle[]) => Vehicle[])) => void] {
  const [vehicles, setVehiclesState] = useState<Vehicle[]>(() => getStoredVehicles());

  useEffect(() => {
    const handleStoreUpdate = () => {
      setVehiclesState(getStoredVehicles());
    };
    window.addEventListener(STORE_UPDATE_EVENT, handleStoreUpdate);
    window.addEventListener("storage", handleStoreUpdate);
    return () => {
      window.removeEventListener(STORE_UPDATE_EVENT, handleStoreUpdate);
      window.removeEventListener("storage", handleStoreUpdate);
    };
  }, []);

  const updateVehicles = (updater: Vehicle[] | ((prev: Vehicle[]) => Vehicle[])) => {
    const next = typeof updater === "function" ? updater(getStoredVehicles()) : updater;
    setVehiclesState(next);
    saveStoredVehicles(next);
  };

  return [vehicles, updateVehicles];
}

// Custom React Hook for Reactive Brands Store
export function useBrandsStore(): {
  brands: string[];
  addBrand: (brandName: string) => boolean;
  removeBrand: (brandName: string) => void;
} {
  const [brands, setBrandsState] = useState<string[]>(() => getStoredBrands());

  useEffect(() => {
    const handleStoreUpdate = () => {
      setBrandsState(getStoredBrands());
    };
    window.addEventListener(STORE_UPDATE_EVENT, handleStoreUpdate);
    window.addEventListener("storage", handleStoreUpdate);
    return () => {
      window.removeEventListener(STORE_UPDATE_EVENT, handleStoreUpdate);
      window.removeEventListener("storage", handleStoreUpdate);
    };
  }, []);

  const addBrand = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    const current = getStoredBrands();
    if (current.some((b) => b.toLowerCase() === trimmed.toLowerCase())) return false;
    const next = [...current, trimmed].sort();
    setBrandsState(next);
    saveStoredBrands(next);
    return true;
  };

  const removeBrand = (name: string) => {
    const current = getStoredBrands();
    const next = current.filter((b) => b.toLowerCase() !== name.toLowerCase());
    setBrandsState(next);
    saveStoredBrands(next);
  };

  return { brands, addBrand, removeBrand };
}
