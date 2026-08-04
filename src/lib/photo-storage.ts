import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs";
import path from "node:path";

export interface SavePhotosPayload {
  vehicleId: string;
  brand?: string;
  model?: string;
  price?: number | string;
  photos: string[];
  vehicleData?: any;
}

/**
 * Finds or constructs the directory name for a car following the pattern:
 * cars/<vehicle_name>_<uid>
 */
export function getVehicleDirName(brand: string = "", model: string = "", id: string): string {
  const rootCarsDir = path.join(process.cwd(), "cars");

  // Check if a folder matching `*_<id>` or `<id>` already exists in the cars/ root folder
  try {
    if (fs.existsSync(rootCarsDir)) {
      const entries = fs.readdirSync(rootCarsDir);
      const matched = entries.find((e) => e.endsWith(`_${id}`) || e === id);
      if (matched) return matched;
    }
  } catch {}

  // Fallback: construct <vehicle_name>_<uid>
  let name = (model || "").trim();
  if (brand && !name.toLowerCase().includes(brand.toLowerCase())) {
    name = `${brand.trim()}_${name}`;
  }
  const sanitized = name.replace(/[\s\/\\:?*"><|]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
  return sanitized ? `${sanitized}_${id}` : `car_${id}`;
}

export const saveVehiclePhotosToDiskFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as SavePhotosPayload)
  .handler(async ({ data }) => {
    const { vehicleId, brand = "", model = "", price = 0, photos, vehicleData } = data;
    if (!vehicleId || !Array.isArray(photos)) {
      return { success: false, photoPaths: [], folderName: "" };
    }

    try {
      const folderName = getVehicleDirName(brand, model, vehicleId);

      // Path 1: Project Root `cars/<vehicle_name>_<uid>` folder
      const rootCarsDir = path.join(process.cwd(), "cars", folderName);

      // Path 2: Public web `public/cars/<vehicle_name>_<uid>` folder for instant web serving
      const publicCarsDir = path.join(process.cwd(), "public", "cars", folderName);

      await fs.promises.mkdir(rootCarsDir, { recursive: true });
      await fs.promises.mkdir(publicCarsDir, { recursive: true });

      const savedPaths: string[] = [];
      const timestamp = Date.now();

      for (let i = 0; i < photos.length; i++) {
        const item = photos[i];
        if (typeof item !== "string" || !item) continue;

        const fileName = `photo_${String(i + 1).padStart(2, "0")}.jpeg`;
        const rootFilePath = path.join(rootCarsDir, fileName);
        const publicFilePath = path.join(publicCarsDir, fileName);

        if (item.startsWith("data:image/")) {
          // Base64 Data URL -> Write buffer to both root cars/ and public/cars/
          const base64Data = item.includes(",") ? item.split(",")[1] : item;
          if (base64Data) {
            const buffer = Buffer.from(base64Data, "base64");
            await fs.promises.writeFile(rootFilePath, buffer);
            await fs.promises.writeFile(publicFilePath, buffer);
            savedPaths.push(`/cars/${folderName}/${fileName}?v=${timestamp}`);
          }
        } else if (item.startsWith("/cars/")) {
          // Already a local path in /cars/ -> Ensure it is synced into public/cars/
          const cleanPath = item.split("?")[0];
          const sourcePath = path.join(process.cwd(), "public", cleanPath);
          const rootSourcePath = path.join(process.cwd(), cleanPath);

          if (fs.existsSync(rootSourcePath) && !fs.existsSync(publicFilePath)) {
            await fs.promises.copyFile(rootSourcePath, publicFilePath);
          } else if (fs.existsSync(sourcePath) && !fs.existsSync(rootFilePath)) {
            await fs.promises.copyFile(sourcePath, rootFilePath);
          }
          savedPaths.push(cleanPath);
        } else {
          // Standard URL or path
          savedPaths.push(item);
        }
      }

      // Clean up & delete any old photo files in disk folders that are no longer part of the updated photos list
      const currentFileNames = new Set(
        savedPaths.map((_, idx) => `photo_${String(idx + 1).padStart(2, "0")}.jpeg`)
      );

      for (const targetDir of [rootCarsDir, publicCarsDir]) {
        try {
          if (fs.existsSync(targetDir)) {
            const files = await fs.promises.readdir(targetDir);
            for (const file of files) {
              // Delete photo_XX files that are beyond the new photo count
              if (/^photo_\d+\.(jpeg|jpg|png|webp)$/i.test(file) && !currentFileNames.has(file)) {
                const filePath = path.join(targetDir, file);
                await fs.promises.unlink(filePath).catch(() => {});
              }
            }
          }
        } catch (err) {
          console.warn(`[Cleanup Warning] Failed cleaning ${targetDir}:`, err);
        }
      }

      // Write info.json into cars/<vehicle_name>_<uid>/info.json
      const infoObj = {
        id: parseInt(vehicleId, 10) || vehicleId,
        uid: vehicleId,
        title: `${brand} ${model}`.trim() || folderName,
        brand,
        model,
        price,
        photos: savedPaths.map((p, idx) => ({
          filename: `photo_${String(idx + 1).padStart(2, "0")}.jpeg`,
          url: p,
        })),
        ...(vehicleData || {}),
        updatedAt: new Date().toISOString(),
      };

      await fs.promises.writeFile(path.join(rootCarsDir, "info.json"), JSON.stringify(infoObj, null, 2));
      await fs.promises.writeFile(path.join(publicCarsDir, "info.json"), JSON.stringify(infoObj, null, 2));

      return {
        success: true,
        photoPaths: savedPaths,
        folderName,
        diskDirectory: `cars/${folderName}`,
      };
    } catch (err: any) {
      console.error("[Save Vehicle Photos Error]", err);
      return {
        success: false,
        photoPaths: photos,
        folderName: "",
        diskDirectory: "",
      };
    }
  });
