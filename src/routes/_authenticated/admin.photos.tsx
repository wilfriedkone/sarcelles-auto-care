import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Camera, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import {
  GALLERY_BUCKET,
  compressImage,
  galleryPhotoUrl,
  type GalleryPhoto,
} from "@/lib/gallery";

export const Route = createFileRoute("/_authenticated/admin/photos")({
  head: () => ({
    meta: [
      { title: "Photos | Espace garage DSK AUTO 95" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPhotos,
});

const PHOTOS_KEY = ["admin", "gallery-photos"] as const;
const MAX_INPUT_BYTES = 25 * 1024 * 1024;

function AdminPhotos() {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null);

  const { data: photos = [], isLoading, isError } = useQuery({
    queryKey: PHOTOS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("id, storage_path, alt, position, published, width, height")
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as GalleryPhoto[];
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: PHOTOS_KEY });

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      toast.error("Choisissez des photos (JPG, PNG, HEIC…).");
      return;
    }
    setUploading({ done: 0, total: list.length });
    let position = photos.reduce((max, p) => Math.max(max, p.position), 0);
    let failed = 0;

    for (const file of list) {
      try {
        if (file.size > MAX_INPUT_BYTES) throw new Error("Photo trop lourde (25 Mo max).");
        const { blob, width, height } = await compressImage(file);
        const path = `${crypto.randomUUID()}.webp`;
        const upload = await supabase.storage
          .from(GALLERY_BUCKET)
          .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
        if (upload.error) throw upload.error;
        position += 1;
        const { error } = await supabase
          .from("gallery_photos")
          .insert({ storage_path: path, alt: "", position, width, height });
        if (error) {
          await supabase.storage.from(GALLERY_BUCKET).remove([path]);
          throw error;
        }
      } catch (err) {
        failed += 1;
        console.error("Photo upload failed", err);
      }
      setUploading((u) => (u ? { ...u, done: u.done + 1 } : u));
    }

    setUploading(null);
    if (fileInput.current) fileInput.current.value = "";
    await refresh();
    if (failed === 0) toast.success(list.length > 1 ? `${list.length} photos ajoutées` : "Photo ajoutée");
    else toast.error(`${failed} photo(s) n'ont pas pu être ajoutées.`);
  }

  const update = useMutation({
    mutationFn: async (vars: { id: string; patch: Partial<Pick<GalleryPhoto, "alt" | "published" | "position">> }) => {
      const { error } = await supabase.from("gallery_photos").update(vars.patch).eq("id", vars.id);
      if (error) throw error;
    },
    onSuccess: () => void refresh(),
    onError: () => toast.error("Modification impossible"),
  });

  const remove = useMutation({
    mutationFn: async (photo: GalleryPhoto) => {
      const { error } = await supabase.from("gallery_photos").delete().eq("id", photo.id);
      if (error) throw error;
      await supabase.storage.from(GALLERY_BUCKET).remove([photo.storage_path]);
    },
    onSuccess: () => {
      toast.success("Photo supprimée");
      void refresh();
    },
    onError: () => toast.error("Suppression impossible"),
  });

  /** Échange la position de deux photos voisines. */
  async function move(index: number, direction: -1 | 1) {
    const a = photos[index];
    const b = photos[index + direction];
    if (!a || !b) return;
    const posA = a.position === b.position ? a.position + direction : b.position;
    await Promise.all([
      update.mutateAsync({ id: a.id, patch: { position: posA } }),
      update.mutateAsync({ id: b.id, patch: { position: a.position } }),
    ]);
  }

  const published = photos.filter((p) => p.published).length;

  return (
    <AdminShell
      title="Photos"
      actions={
        <Button onClick={() => fileInput.current?.click()} disabled={uploading !== null}>
          {uploading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="size-4" aria-hidden="true" />
          )}
          {uploading ? `Envoi ${uploading.done}/${uploading.total}…` : "Ajouter des photos"}
        </Button>
      }
    >
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-label="Choisir des photos"
        onChange={(e) => void onFiles(e.target.files)}
      />

      <p className="text-sm text-muted-foreground">
        Les photos visibles apparaissent dans la galerie « Notre garage » de la page d'accueil,
        dans cet ordre ({published} visible{published > 1 ? "s" : ""}). Elles sont automatiquement
        allégées avant l'envoi.
      </p>

      {isError ? (
        <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
          Lecture impossible pour le moment. Réessayez dans quelques instants.
        </p>
      ) : null}

      {isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-card" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="mt-6 flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border px-6 py-16 text-center text-muted-foreground hover:border-primary hover:text-foreground"
        >
          <Camera className="size-10" aria-hidden="true" />
          <span className="font-semibold">Ajouter les premières photos du garage</span>
          <span className="text-sm">Façade, atelier, équipe, véhicules… Tant qu'il n'y en a aucune, le site affiche des photos d'illustration.</span>
        </button>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <li key={photo.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative">
                <img
                  src={galleryPhotoUrl(photo.storage_path)}
                  alt={photo.alt || "Photo sans légende"}
                  loading="lazy"
                  className={`aspect-[4/3] w-full object-cover ${photo.published ? "" : "opacity-40 grayscale"}`}
                />
                {!photo.published ? (
                  <span className="absolute top-2 left-2 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold">
                    Masquée
                  </span>
                ) : null}
              </div>
              <div className="space-y-3 p-3">
                <Input
                  aria-label="Légende de la photo"
                  defaultValue={photo.alt}
                  maxLength={140}
                  placeholder="Légende (ex. : l'atelier, la façade)"
                  onBlur={(e) => {
                    const alt = e.target.value.trim();
                    if (alt !== photo.alt) update.mutate({ id: photo.id, patch: { alt } });
                  }}
                />
                <div className="flex items-center justify-between gap-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <Switch
                      checked={photo.published}
                      onCheckedChange={(v) => update.mutate({ id: photo.id, patch: { published: v } })}
                    />
                    Visible sur le site
                  </label>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Monter"
                      disabled={index === 0}
                      onClick={() => void move(index, -1)}
                    >
                      <ArrowUp className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Descendre"
                      disabled={index === photos.length - 1}
                      onClick={() => void move(index, 1)}
                    >
                      <ArrowDown className="size-4" aria-hidden="true" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Supprimer la photo" className="text-destructive hover:text-destructive">
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette photo ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Elle disparaîtra du site. Pour la cacher sans la perdre, utilisez plutôt
                            « Visible sur le site ».
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => remove.mutate(photo)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
