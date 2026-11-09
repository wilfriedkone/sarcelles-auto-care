import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Car,
  ChevronRight,
  Inbox,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminShell, QUOTES_KEY } from "@/components/admin/AdminShell";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { primaryContact, site } from "@/config/site";
import {
  deleteQuoteRequest,
  listQuoteRequests,
  updateQuoteNote,
  updateQuoteStatus,
  type RequestStatus,
} from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/demandes")({
  head: () => ({
    meta: [
      { title: "Demandes reçues | Espace garage DSK AUTO 95" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRequests,
});

type Row = {
  id: string;
  reference: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  vehicle: string | null;
  preferred_contact: string | null;
  message: string;
  status: RequestStatus;
  admin_note: string | null;
  created_at: string;
};

const STATUS: Record<RequestStatus, { label: string; dot: string }> = {
  nouvelle: { label: "Nouvelle", dot: "bg-primary" },
  contactee: { label: "Contactée", dot: "bg-amber-400" },
  traitee: { label: "Traitée", dot: "bg-emerald-500" },
  archivee: { label: "Archivée", dot: "bg-zinc-500" },
};

type Filter = "en-cours" | "traitee" | "archivee" | "toutes";
const FILTERS: { value: Filter; label: string; match: (s: RequestStatus) => boolean }[] = [
  { value: "en-cours", label: "En cours", match: (s) => s === "nouvelle" || s === "contactee" },
  { value: "traitee", label: "Traitées", match: (s) => s === "traitee" },
  { value: "archivee", label: "Archivées", match: (s) => s === "archivee" },
  { value: "toutes", label: "Toutes", match: () => true },
];

const PREFERRED: Record<string, string> = {
  telephone: "Téléphone",
  email: "E-mail",
  "peu-importe": "Peu importe",
};

function AdminRequests() {
  const fetchRequests = useServerFn(listQuoteRequests);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("en-cours");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: QUOTES_KEY,
    queryFn: () => fetchRequests(),
    refetchInterval: 60_000,
  });
  const rows = (data?.requests ?? []) as Row[];

  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((f) => [f.value, rows.filter((r) => f.match(r.status)).length]),
      ) as Record<Filter, number>,
    [rows],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const match = FILTERS.find((f) => f.value === filter)!.match;
    return rows.filter((row) => {
      if (!match(row.status)) return false;
      if (!q) return true;
      return [row.reference, row.full_name, row.phone, row.email, row.vehicle, row.service]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [rows, search, filter]);

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  return (
    <AdminShell
      title="Demandes"
      actions={
        <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isFetching}>
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden="true" />
          Actualiser
        </Button>
      }
    >
      {data?.ok === false || isError ? (
        <p className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
          Lecture impossible pour le moment. Réessayez dans quelques instants.
        </p>
      ) : null}

      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          aria-label="Rechercher une demande"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nom, téléphone, véhicule, référence…"
          className="h-12 pl-11 text-base"
        />
      </div>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Filtrer">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
              filter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
            <span className="opacity-80">{counts[f.value] ?? 0}</span>
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }, (_, i) => (
            <li key={i} className="h-24 animate-pulse rounded-xl border border-border bg-card" />
          ))
        ) : filtered.length === 0 ? (
          <li className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">
            <Inbox className="size-10" aria-hidden="true" />
            <p>{rows.length === 0 ? "Aucune demande reçue pour l'instant." : "Aucune demande dans ce filtre."}</p>
          </li>
        ) : (
          filtered.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                onClick={() => setSelectedId(row.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-4 rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/60",
                  row.status === "nouvelle" ? "border-primary/50" : "border-border",
                )}
              >
                <span className={cn("size-2.5 shrink-0 rounded-full", STATUS[row.status].dot)} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className={cn("truncate text-base", row.status === "nouvelle" ? "font-bold" : "font-semibold")}>
                      {row.full_name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(row.created_at)}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                    {row.service || "Demande"}
                    {row.vehicle ? ` · ${row.vehicle}` : ""}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {STATUS[row.status].label}
                    {row.phone ? ` · ${row.phone}` : ""}
                    {row.admin_note ? " · note" : ""}
                  </span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            </li>
          ))
        )}
      </ul>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-lg">
          {selected ? <RequestDetail key={selected.id} row={selected} onDeleted={() => setSelectedId(null)} /> : null}
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}

function RequestDetail({ row, onDeleted }: { row: Row; onDeleted: () => void }) {
  const queryClient = useQueryClient();
  const changeStatus = useServerFn(updateQuoteStatus);
  const saveNote = useServerFn(updateQuoteNote);
  const remove = useServerFn(deleteQuoteRequest);
  const [note, setNote] = useState(row.admin_note ?? "");
  useEffect(() => setNote(row.admin_note ?? ""), [row.admin_note]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: QUOTES_KEY });

  const statusMutation = useMutation({
    mutationFn: (status: RequestStatus) => changeStatus({ data: { id: row.id, status } }),
    onSuccess: (r) => (r.ok ? void refresh() : toast.error("Mise à jour impossible")),
    onError: () => toast.error("Mise à jour impossible"),
  });
  const noteMutation = useMutation({
    mutationFn: () => saveNote({ data: { id: row.id, note } }),
    onSuccess: (r) => {
      if (r.ok) {
        toast.success("Note enregistrée");
        void refresh();
      } else toast.error("Enregistrement impossible");
    },
    onError: () => toast.error("Enregistrement impossible"),
  });
  const deleteMutation = useMutation({
    mutationFn: () => remove({ data: { id: row.id } }),
    onSuccess: (r) => {
      if (r.ok) {
        toast.success("Demande supprimée");
        onDeleted();
        void refresh();
      } else toast.error("Suppression impossible");
    },
    onError: () => toast.error("Suppression impossible"),
  });

  /** Après une prise de contact, une demande "nouvelle" passe à "contactée". */
  function markContacted() {
    if (row.status === "nouvelle") statusMutation.mutate("contactee");
  }

  const firstName = row.full_name.split(" ")[0] ?? row.full_name;
  const replyText =
    `Bonjour ${firstName}, ici ${primaryContact.name} du garage ${site.name} à Sarcelles. ` +
    `Je reviens vers vous au sujet de votre demande${row.service ? ` (${row.service})` : ""}. `;
  const intl = row.phone ? toInternational(row.phone) : null;

  const actions = [
    row.phone && { label: "Appeler", icon: Phone, href: `tel:${row.phone}`, primary: true },
    intl && {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/${intl}?text=${encodeURIComponent(replyText)}`,
      external: true,
    },
    row.phone && { label: "SMS", icon: MessageSquare, href: `sms:${row.phone}?&body=${encodeURIComponent(replyText)}` },
    row.email && {
      label: "E-mail",
      icon: Mail,
      href: `mailto:${row.email}?subject=${encodeURIComponent(`Votre demande ${row.reference} — ${site.name}`)}&body=${encodeURIComponent(`${replyText}\n\n${primaryContact.name}\n${site.name}\n${primaryContact.phone}`)}`,
    },
  ].filter(Boolean) as { label: string; icon: typeof Phone; href: string; primary?: boolean; external?: boolean }[];

  return (
    <div className="flex min-h-full flex-col">
      <SheetHeader className="border-b border-border p-5 text-left">
        <SheetTitle className="font-display text-2xl font-bold uppercase">{row.full_name}</SheetTitle>
        <SheetDescription>
          Reçue {new Date(row.created_at).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })} ·{" "}
          <span className="font-mono">{row.reference}</span>
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-6 p-5">
        {/* Répondre en un clic */}
        <section aria-label="Répondre">
          <div className="grid grid-cols-2 gap-2">
            {actions.map((a) => (
              <Button
                key={a.label}
                asChild
                size="lg"
                variant={a.primary ? "default" : "outline"}
                className={cn("h-14 text-base", a.primary && actions.length % 2 === 1 && "col-span-2")}
              >
                <a
                  href={a.href}
                  onClick={markContacted}
                  {...(a.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  <a.icon className="size-5" aria-hidden="true" />
                  {a.label}
                </a>
              </Button>
            ))}
          </div>
          {actions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun moyen de contact laissé.</p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Les messages s'ouvrent avec un texte déjà rédigé, à compléter avant l'envoi.
            </p>
          )}
        </section>

        {/* Demande */}
        <section className="rounded-xl border border-border bg-card p-4">
          <dl className="grid gap-3 text-sm">
            <Info icon={Wrench} label="Service" value={row.service} />
            <Info icon={Car} label="Véhicule" value={row.vehicle} />
            <Info icon={Phone} label="Téléphone" value={row.phone} />
            <Info icon={Mail} label="E-mail" value={row.email} />
            <Info
              icon={MessageSquare}
              label="Préfère être contacté par"
              value={row.preferred_contact ? (PREFERRED[row.preferred_contact] ?? row.preferred_contact) : null}
            />
          </dl>
          <p className="mt-4 whitespace-pre-wrap rounded-lg bg-background p-3 text-[15px]">{row.message}</p>
        </section>

        {/* Statut */}
        <section>
          <h2 className="mb-2 text-sm font-semibold">Statut</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Statut de la demande">
            {(Object.keys(STATUS) as RequestStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={row.status === s}
                disabled={statusMutation.isPending}
                onClick={() => statusMutation.mutate(s)}
                className={cn(
                  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors",
                  row.status === s
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <span className={cn("size-2 rounded-full", STATUS[s].dot)} aria-hidden="true" />
                {STATUS[s].label}
              </button>
            ))}
          </div>
        </section>

        {/* Note interne */}
        <section>
          <label htmlFor="admin-note" className="mb-2 block text-sm font-semibold">
            Note interne <span className="font-normal text-muted-foreground">(visible seulement ici)</span>
          </label>
          <Textarea
            id="admin-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Ex. : rappelé le 12/11, passe jeudi pour un diagnostic. Devis 180 €."
            className="text-base"
          />
          <Button
            className="mt-2"
            variant="secondary"
            disabled={noteMutation.isPending || note === (row.admin_note ?? "")}
            onClick={() => noteMutation.mutate()}
          >
            Enregistrer la note
          </Button>
        </section>
      </div>

      <div className="border-t border-border p-5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="text-destructive hover:text-destructive">
              <Trash2 className="size-4" aria-hidden="true" />
              Supprimer cette demande
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer définitivement ?</AlertDialogTitle>
              <AlertDialogDescription>
                La demande de {row.full_name} et toutes ses informations seront effacées. À faire
                notamment si le client demande la suppression de ses données.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="break-words">{value}</dd>
      </div>
    </div>
  );
}

/** "06 12 34 56 78" → "33612345678" (format attendu par WhatsApp). */
function toInternational(phone: string): string | null {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1) || null;
  if (digits.startsWith("00")) return digits.slice(2) || null;
  if (/^0\d{9}$/.test(digits)) return `33${digits.slice(1)}`;
  return digits.length >= 8 ? digits : null;
}

const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });
function timeAgo(iso: string): string {
  const minutes = Math.round((new Date(iso).getTime() - Date.now()) / 60_000);
  if (minutes > -60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours > -24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (days > -7) return rtf.format(days, "day");
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
