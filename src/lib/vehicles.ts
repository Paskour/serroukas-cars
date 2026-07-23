export type VehicleType = "passenger" | "commercial" | "truck" | "machine";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  fuel: string;
  cc: number;
  price: number;
  type: VehicleType;
  image: string;
  images?: string[];
  badge?: string;
  horsepower?: number;
  transmission?: string;
  drive?: string;
  doors?: number;
  seats?: number;
  exteriorColor?: string;
  interiorColor?: string;
  emissions?: string;
  combinedConsumption?: string;
  grossWeight?: string;
  euroClass?: string;
  upholstery?: string;
  roadTax?: string;
  wheelSize?: string;
  cityConsumption?: string;
  highwayConsumption?: string;
  payload?: string;
  registration?: string;
  vin?: string;
  axles?: number;
}

// Real photos from serroukas-cars.gr
const SR = "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56";
const BANNER = "https://www.serroukas-cars.gr/wp-content/uploads/2024";

export const vehicles: Vehicle[] = [
  {
    id: "v1",
    brand: "Ford",
    model: "Ranger RS",
    year: 2023,
    km: 22000,
    fuel: "Diesel",
    cc: 2000,
    price: 42900,
    type: "commercial",
    image: `${SR}/2025/09/img_2676-scaled.jpeg.webp`,
    badge: "TOP PICK",
  },
  {
    id: "v2",
    brand: "Mercedes-Benz",
    model: "A 180 AMG Line",
    year: 2022,
    km: 48000,
    fuel: "Petrol",
    cc: 1332,
    price: 27500,
    type: "passenger",
    image: `${SR}/2025/11/img_3474-scaled.jpeg.webp`,
    badge: "NEW ARRIVAL",
  },
  {
    id: "v3",
    brand: "Peugeot",
    model: "2008 GT-Line",
    year: 2021,
    km: 61000,
    fuel: "Diesel",
    cc: 1499,
    price: 18900,
    type: "passenger",
    image: `${SR}/2025/11/img_2937-1-scaled.jpeg.webp`,
  },
  {
    id: "v4",
    brand: "Ford",
    model: "Fiesta Active",
    year: 2020,
    km: 74000,
    fuel: "Petrol",
    cc: 1000,
    price: 13500,
    type: "passenger",
    image: `${SR}/2025/11/whatsapp-image-2025-11-25-at-6.20.32-pm.jpeg.webp`,
  },
  {
    id: "v5",
    brand: "Fiat",
    model: "Ducato Maxi",
    year: 2021,
    km: 89000,
    fuel: "Diesel",
    cc: 2287,
    price: 22900,
    type: "commercial",
    image: `${BANNER}/07/banner-a.jpg.webp`,
  },
  {
    id: "v6",
    brand: "Citroen",
    model: "Jumper L3H2",
    year: 2020,
    km: 118000,
    fuel: "Diesel",
    cc: 2200,
    price: 17400,
    type: "commercial",
    image: `${BANNER}/07/banner-b.jpg.webp`,
  },
  {
    id: "v7",
    brand: "Nissan",
    model: "Navara N-Guard",
    year: 2022,
    km: 52000,
    fuel: "Diesel",
    cc: 2298,
    price: 33900,
    type: "commercial",
    image: `${BANNER}/08/banner-c.jpg.webp`,
  },
  {
    id: "v8",
    brand: "Abarth",
    model: "595 Competizione",
    year: 2021,
    km: 32000,
    fuel: "Petrol",
    cc: 1368,
    price: 19900,
    type: "passenger",
    image: "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=1200&q=80&auto=format&fit=crop",
  },
];

export interface Brand {
  name: string;
  logo: string;
}

const LOGO = "https://www.serroukas-cars.gr/wp-content/uploads/2024/06";

export const brands: Brand[] = [
  { name: "Abarth", logo: `${LOGO}/make-32199-150x150.png.webp` },
  { name: "Citroen", logo: `${LOGO}/make-13214-150x150.png.webp` },
  { name: "Fiat", logo: `${LOGO}/make-13302-150x150.png.webp` },
  { name: "Ford", logo: `${LOGO}/make-13272-150x150.png.webp` },
  { name: "Mercedes-Benz", logo: `${LOGO}/make-32186-150x150.png.webp` },
  { name: "Nissan", logo: `${LOGO}/make-14094-150x150.png.webp` },
];

export const brandNames = brands.map((b) => b.name);
