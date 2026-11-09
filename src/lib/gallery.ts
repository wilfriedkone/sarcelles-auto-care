/** Galerie photos gérée depuis l'espace admin (bucket de stockage "galerie"). */

export const GALLERY_BUCKET = "galerie";

export type GalleryPhoto = {
  id: string;
  storage_path: string;
  alt: string;
  position: number;
  published: boolean;
  width: number | null;
  height: number | null;
};

/** Adresse publique d'une photo du bucket (lecture publique). */
export function galleryPhotoUrl(storagePath: string): string {
  const base = import.meta.env["VITE_SUPABASE_URL"] as string;
  const path = storagePath.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/${GALLERY_BUCKET}/${path}`;
}

/**
 * Redimensionne et compresse une photo dans le navigateur avant envoi :
 * 1920 px max, WebP ~80 %. Une photo de téléphone de 8 Mo passe à ~300 Ko.
 */
export async function compressImage(
  file: File,
  maxSize = 1920,
  quality = 0.8,
): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Compression impossible sur cet appareil.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality),
  );
  if (!blob) throw new Error("Compression impossible sur cet appareil.");
  return { blob, width, height };
}
