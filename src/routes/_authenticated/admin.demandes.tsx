import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, Mail, Phone, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  listQuoteRequests,
  updateQuoteStatus,
  type RequestStatus,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/demandes")({
  head: () => ({
    meta: [
      { title: "Demandes reçues | Administration DSK AUTO 95" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Espace d'administration privé." },
      { property: "og:title", content: "Administration DSK AUTO 95" },
      { property: "og:description", content: "Espace privé." },
    ],
  }),
  component: AdminRequests,
});

const statuses: { value: RequestStatus | "toutes"; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  { value: "nouvelle", label: "Nouvelle" },
  { value: "contactee", label: "Contactée" },
  { value: "traitee", label: "Traitée" },
  { value: "archivee", label: "Archivée" },
];

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
  created_at: string;
};

function AdminRequests() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchRequests = useServerFn(listQuoteRequests);
  const changeStatus = useServerFn(updateQuoteStatus);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RequestStatus | "toutes">("toutes");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin", "quote-requests"],
    queryFn: () => fetchRequests(),
  });

  const mutation = useMutation({
    mutationFn: (vars: { id: string; status: RequestStatus }) =>
      changeStatus({ data: vars }),
    onSuccess: (result) => {
      if (result.ok) {
        toast.success("Statut mis à jour");
        void queryClient.invalidateQueries({
          queryKey: ["admin", "quote-requests"],
        });
      } else {
        toast.error("Mise à jour impossible");
      }
    },
    onError: () => toast.error("Mise à jour impossible"),
  });

  const rows = (data?.requests ?? []) as Row[];
  const allowed = data?.ok !== false;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (status !== "toutes" && row.status !== status) return false;
      if (!q) return true;
      return [row.reference, row.full_name, row.phone, row.email, row.vehicle, row.service]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [rows, search, status]);

  const selected = filtered.find((r) => r.id === selectedId) ?? null;

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/admin/login", replace: true });
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase">
              Demandes reçues
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Espace privé — DSK AUTO 95 GARAGE
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
              <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} aria-hidden="true" />
              Actualiser
            </Button>
            <Button variant="secondary" onClick={() => void signOut()}>
              <LogOut className="size-4" aria-hidden="true" />
              Déconnexion
            </Button>
          </div>
        </div>

        {!allowed || isError ? (
          <p className="mt-10 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
            Accès refusé ou lecture impossible. Votre compte doit disposer du
            rôle administrateur.
          </p>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="search" className="mb-2 block text-sm">
              Rechercher
            </Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Référence, nom, téléphone, véhicule…"
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status" className="mb-2 block text-sm">
              Statut
            </Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as RequestStatus | "toutes")}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Liste des demandes reçues</caption>
              <thead className="bg-card text-xs uppercase text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">Référence</th>
                  <th scope="col" className="px-4 py-3">Nom</th>
                  <th scope="col" className="px-4 py-3">Service</th>
                  <th scope="col" className="px-4 py-3">Statut</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      Chargement…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      Aucune demande.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedId(row.id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedId(row.id);
                        }
                      }}
                      className={`cursor-pointer border-t border-border transition-colors hover:bg-card ${
                        selectedId === row.id ? "bg-card" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-primary">{row.reference}</td>
                      <td className="px-4 py-3">{row.full_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.service ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-border px-2 py-1 text-xs uppercase">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(row.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <aside className="rounded-xl border border-border bg-card p-6" aria-live="polite">
            {selected ? (
              <>
                <h2 className="font-display text-xl font-bold uppercase">
                  {selected.full_name}
                </h2>
                <p className="mt-1 font-mono text-xs text-primary">{selected.reference}</p>

                <dl className="mt-5 space-y-3 text-sm">
                  <Detail label="Téléphone" value={selected.phone ?? "—"} />
                  <Detail label="E-mail" value={selected.email ?? "—"} />
                  <Detail label="Service" value={selected.service ?? "—"} />
                  <Detail label="Véhicule" value={selected.vehicle ?? "—"} />
                  <Detail
                    label="Contact préféré"
                    value={selected.preferred_contact ?? "—"}
                  />
                  <Detail
                    label="Reçue le"
                    value={new Date(selected.created_at).toLocaleString("fr-FR")}
                  />
                </dl>

                <p className="mt-5 whitespace-pre-wrap rounded-lg border border-border bg-background p-4 text-sm">
                  {selected.message}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {selected.phone ? (
                    <Button asChild size="sm">
                      <a href={`tel:${selected.phone}`}>
                        <Phone className="size-4" aria-hidden="true" />
                        Appeler
                      </a>
                    </Button>
                  ) : null}
                  {selected.email ? (
                    <Button asChild size="sm" variant="outline">
                      <a href={`mailto:${selected.email}?subject=Votre demande ${selected.reference}`}>
                        <Mail className="size-4" aria-hidden="true" />
                        Envoyer un e-mail
                      </a>
                    </Button>
                  ) : null}
                </div>

                <div className="mt-6">
                  <Label htmlFor="new-status" className="mb-2 block text-sm">
                    Changer le statut
                  </Label>
                  <select
                    id="new-status"
                    value={selected.status}
                    disabled={mutation.isPending}
                    onChange={(e) =>
                      mutation.mutate({
                        id: selected.id,
                        status: e.target.value as RequestStatus,
                      })
                    }
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {statuses
                      .filter((s) => s.value !== "toutes")
                      .map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                  </select>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sélectionnez une demande pour afficher sa fiche détaillée.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
