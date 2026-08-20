import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  FileSignature,
  Loader2,
  LogOut,
  Lock,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type DataColumn } from "@/components/admin/data-table";
import { formatDateTime } from "@/lib/csv";
import {
  adminCreateEvent,
  adminCreatePetition,
  adminDeleteEvent,
  adminDeletePetition,
  adminEventRegistrations,
  adminListEvents,
  adminListPetitions,
  adminListVolunteers,
  adminLogin,
  adminLogout,
  adminMe,
  adminPetitionSignatures,
  adminSummary,
  adminTogglePetition,
  type AdminEventRow,
  type AdminPetitionRow,
  type PersonRow,
  type VolunteerRow,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Painel da Campanha — Willian Rocha" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

// ----------------------------------------------------------------
// Colunas das planilhas
// ----------------------------------------------------------------
const personColumns: DataColumn<PersonRow>[] = [
  { label: "Nome", value: (r) => r.nome },
  { label: "Cidade", value: (r) => r.cidade },
  { label: "Estado", value: (r) => r.estado },
  { label: "Telefone", value: (r) => r.telefone },
  { label: "Data de envio", value: (r) => formatDateTime(r.created_at) },
];

const volunteerColumns: DataColumn<VolunteerRow>[] = [
  { label: "Nome", value: (r) => r.nome },
  { label: "Telefone", value: (r) => r.telefone },
  { label: "E-mail", value: (r) => r.email ?? "" },
  { label: "Cidade", value: (r) => r.cidade ?? "" },
  { label: "Bairro", value: (r) => r.bairro ?? "" },
  { label: "Como quer ajudar", value: (r) => r.mensagem ?? "" },
  { label: "Data de envio", value: (r) => formatDateTime(r.created_at) },
];

const eventColumns: DataColumn<AdminEventRow>[] = [
  { label: "Título", value: (r) => r.titulo },
  { label: "Data", value: (r) => formatDateTime(r.data_evento) },
  { label: "Cidade", value: (r) => r.cidade ?? "" },
  { label: "Local", value: (r) => r.local ?? "" },
  { label: "Inscritos", value: (r) => r.inscritos },
  { label: "Link", value: (r) => `/eventos/${r.slug}` },
];

const petitionColumns: DataColumn<AdminPetitionRow>[] = [
  { label: "Título", value: (r) => r.titulo },
  { label: "Assinaturas", value: (r) => r.assinaturas },
  { label: "Meta", value: (r) => r.meta },
  { label: "Situação", value: (r) => (r.ativo ? "Ativo" : "Oculto") },
  { label: "Link", value: (r) => `/abaixo-assinados/${r.slug}` },
];

// ----------------------------------------------------------------
// Página
// ----------------------------------------------------------------
function AdminPage() {
  const me = useServerFn(adminMe);
  const session = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => me(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (session.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session.data?.email) {
    return <LoginScreen />;
  }

  return <Dashboard email={session.data.email} hasDatabase={session.data.hasDatabase} />;
}

// ----------------------------------------------------------------
// Login
// ----------------------------------------------------------------
function LoginScreen() {
  const queryClient = useQueryClient();
  const login = useServerFn(adminLogin);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await login({
        data: {
          email: String(fd.get("email") || ""),
          password: String(fd.get("password") || ""),
        },
      });
      if (res.ok) {
        await queryClient.invalidateQueries({ queryKey: ["admin"] });
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-lg bg-background p-8 shadow-lg"
      >
        <div className="text-center">
          <Lock className="mx-auto h-8 w-8 text-brand-dark" />
          <h1 className="mt-3 font-display text-2xl uppercase text-brand-dark">
            Painel da Campanha
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Acesso restrito à equipe.</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" required autoComplete="username" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-dark font-bold uppercase tracking-wide text-brand-yellow hover:bg-brand-dark/90"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}

// ----------------------------------------------------------------
// Dashboard
// ----------------------------------------------------------------
function Dashboard({ email, hasDatabase }: { email: string; hasDatabase: boolean }) {
  const queryClient = useQueryClient();
  const logout = useServerFn(adminLogout);
  const summaryFn = useServerFn(adminSummary);

  const summary = useQuery({
    queryKey: ["admin", "summary"],
    queryFn: () => summaryFn(),
    enabled: hasDatabase,
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-brand-dark text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="font-display text-xl uppercase tracking-wide">
              Painel da <span className="text-brand-yellow">Campanha</span>
            </p>
            <p className="text-xs text-primary-foreground/70">{email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
            onClick={async () => {
              await logout();
              queryClient.clear();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {!hasDatabase && (
          <p className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            O banco de dados não está configurado neste ambiente (<code>DATABASE_URL</code>). Os
            dados só aparecem no site publicado.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Eventos" value={summary.data?.eventos} />
          <StatCard label="Inscritos em eventos" value={summary.data?.inscritos} />
          <StatCard label="Abaixo-assinados" value={summary.data?.abaixoAssinados} />
          <StatCard label="Assinaturas" value={summary.data?.assinaturas} />
          <StatCard label="Voluntários" value={summary.data?.voluntarios} />
        </div>

        <Tabs defaultValue="eventos">
          <TabsList>
            <TabsTrigger value="eventos">
              <CalendarDays className="mr-2 h-4 w-4" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="abaixo-assinados">
              <FileSignature className="mr-2 h-4 w-4" />
              Abaixo-assinados
            </TabsTrigger>
            <TabsTrigger value="voluntarios">
              <Users className="mr-2 h-4 w-4" />
              Voluntários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="eventos" className="mt-6">
            <EventsTab enabled={hasDatabase} />
          </TabsContent>
          <TabsContent value="abaixo-assinados" className="mt-6">
            <PetitionsTab enabled={hasDatabase} />
          </TabsContent>
          <TabsContent value="voluntarios" className="mt-6">
            <VolunteersTab enabled={hasDatabase} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-2xl font-bold text-brand-dark">{value ?? "—"}</p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-xl uppercase text-brand-dark">{children}</h2>;
}

// ----------------------------------------------------------------
// Aba: Eventos
// ----------------------------------------------------------------
type NewEventInput = {
  titulo: string;
  data_evento: string;
  cidade: string;
  local: string;
  imagem_url: string;
  descricao: string;
};

function EventsTab({ enabled }: { enabled: boolean }) {
  const queryClient = useQueryClient();
  const listFn = useServerFn(adminListEvents);
  const createFn = useServerFn(adminCreateEvent);
  const deleteFn = useServerFn(adminDeleteEvent);
  const registrationsFn = useServerFn(adminEventRegistrations);

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<AdminEventRow | null>(null);

  const events = useQuery({
    queryKey: ["admin", "events"],
    queryFn: () => listFn(),
    enabled,
  });

  const registrations = useQuery({
    queryKey: ["admin", "events", selected?.id, "registrations"],
    queryFn: () => registrationsFn({ data: { id: selected!.id } }),
    enabled: Boolean(selected),
  });

  const create = useMutation({
    mutationFn: (data: NewEventInput) => createFn({ data }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Evento criado!");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: () => toast.error("Não foi possível criar o evento."),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Evento excluído.");
      setSelected(null);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: () => toast.error("Não foi possível excluir o evento."),
  });

  if (selected) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para os eventos
        </Button>
        <SectionTitle>Inscritos — {selected.titulo}</SectionTitle>
        <DataTable
          columns={personColumns}
          rows={registrations.data ?? []}
          loading={registrations.isLoading}
          filename={`inscritos-${selected.slug}`}
          emptyMessage="Ninguém se inscreveu neste evento ainda."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle>Eventos</SectionTitle>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancelar" : "Novo evento"}
        </Button>
      </div>

      {showForm && (
        <form
          className="grid gap-4 rounded-lg border bg-card p-5"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const dataHora = String(fd.get("data_evento") || "");
            create.mutate({
              titulo: String(fd.get("titulo") || ""),
              data_evento: new Date(dataHora).toISOString(),
              cidade: String(fd.get("cidade") || ""),
              local: String(fd.get("local") || ""),
              imagem_url: String(fd.get("imagem_url") || ""),
              descricao: String(fd.get("descricao") || ""),
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="ev-titulo">Título *</Label>
            <Input id="ev-titulo" name="titulo" required placeholder="Happy Hour do Debate" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="ev-data">Data e hora *</Label>
              <Input id="ev-data" name="data_evento" type="datetime-local" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ev-cidade">Cidade</Label>
              <Input id="ev-cidade" name="cidade" placeholder="Curitiba" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ev-local">Local</Label>
            <Input
              id="ev-local"
              name="local"
              placeholder="Bar do Didi — Av. Sete de Setembro, 3751"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ev-imagem">Imagem (URL)</Label>
            <Input id="ev-imagem" name="imagem_url" placeholder="/banner-evento.webp" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ev-descricao">Descrição</Label>
            <Textarea id="ev-descricao" name="descricao" rows={4} />
          </div>
          <Button type="submit" disabled={create.isPending} className="justify-self-start">
            {create.isPending ? "Salvando..." : "Publicar evento"}
          </Button>
        </form>
      )}

      <DataTable
        columns={eventColumns}
        rows={events.data ?? []}
        loading={events.isLoading}
        filename="eventos"
        emptyMessage="Nenhum evento cadastrado."
        renderActions={(row) => (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelected(row)}>
              Ver inscritos ({row.inscritos})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (
                  window.confirm(
                    `Excluir "${row.titulo}"? As inscrições deste evento também serão apagadas.`,
                  )
                ) {
                  remove.mutate(row.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}

// ----------------------------------------------------------------
// Aba: Abaixo-assinados
// ----------------------------------------------------------------
type NewPetitionInput = {
  titulo: string;
  descricao: string;
  meta: number;
  imagem_url: string;
};

function PetitionsTab({ enabled }: { enabled: boolean }) {
  const queryClient = useQueryClient();
  const listFn = useServerFn(adminListPetitions);
  const createFn = useServerFn(adminCreatePetition);
  const deleteFn = useServerFn(adminDeletePetition);
  const toggleFn = useServerFn(adminTogglePetition);
  const signaturesFn = useServerFn(adminPetitionSignatures);

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<AdminPetitionRow | null>(null);

  const petitions = useQuery({
    queryKey: ["admin", "petitions"],
    queryFn: () => listFn(),
    enabled,
  });

  const signatures = useQuery({
    queryKey: ["admin", "petitions", selected?.id, "signatures"],
    queryFn: () => signaturesFn({ data: { id: selected!.id } }),
    enabled: Boolean(selected),
  });

  const create = useMutation({
    mutationFn: (data: NewPetitionInput) => createFn({ data }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Abaixo-assinado criado!");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: () => toast.error("Não foi possível criar o abaixo-assinado."),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Abaixo-assinado excluído.");
      setSelected(null);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: () => toast.error("Não foi possível excluir."),
  });

  const toggle = useMutation({
    mutationFn: (vars: { id: number; ativo: boolean }) => toggleFn({ data: vars }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
    onError: () => toast.error("Não foi possível alterar a situação."),
  });

  if (selected) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para os abaixo-assinados
        </Button>
        <SectionTitle>Assinaturas — {selected.titulo}</SectionTitle>
        <DataTable
          columns={personColumns}
          rows={signatures.data ?? []}
          loading={signatures.isLoading}
          filename={`assinaturas-${selected.slug}`}
          emptyMessage="Nenhuma assinatura ainda."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle>Abaixo-assinados</SectionTitle>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancelar" : "Novo abaixo-assinado"}
        </Button>
      </div>

      {showForm && (
        <form
          className="grid gap-4 rounded-lg border bg-card p-5"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            create.mutate({
              titulo: String(fd.get("titulo") || ""),
              descricao: String(fd.get("descricao") || ""),
              meta: Number(fd.get("meta") || 200),
              imagem_url: String(fd.get("imagem_url") || ""),
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="pt-titulo">Título *</Label>
            <Input
              id="pt-titulo"
              name="titulo"
              required
              placeholder="Abaixo-assinado por mais segurança no centro"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pt-descricao">Descrição *</Label>
            <Textarea
              id="pt-descricao"
              name="descricao"
              rows={4}
              required
              placeholder="Explique a causa e por que as pessoas devem assinar."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="pt-meta">Meta de assinaturas *</Label>
              <Input id="pt-meta" name="meta" type="number" min={1} defaultValue={200} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pt-imagem">Imagem (URL)</Label>
              <Input id="pt-imagem" name="imagem_url" placeholder="/banner-causa.webp" />
            </div>
          </div>
          <Button type="submit" disabled={create.isPending} className="justify-self-start">
            {create.isPending ? "Salvando..." : "Publicar abaixo-assinado"}
          </Button>
        </form>
      )}

      <DataTable
        columns={petitionColumns}
        rows={petitions.data ?? []}
        loading={petitions.isLoading}
        filename="abaixo-assinados"
        emptyMessage="Nenhum abaixo-assinado cadastrado."
        renderActions={(row) => (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelected(row)}>
              Ver assinaturas ({row.assinaturas})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggle.mutate({ id: row.id, ativo: !row.ativo })}
            >
              {row.ativo ? "Ocultar" : "Reativar"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (
                  window.confirm(`Excluir "${row.titulo}"? As assinaturas também serão apagadas.`)
                ) {
                  remove.mutate(row.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}

// ----------------------------------------------------------------
// Aba: Voluntários
// ----------------------------------------------------------------
function VolunteersTab({ enabled }: { enabled: boolean }) {
  const listFn = useServerFn(adminListVolunteers);
  const volunteers = useQuery({
    queryKey: ["admin", "volunteers"],
    queryFn: () => listFn(),
    enabled,
  });

  return (
    <div className="space-y-5">
      <SectionTitle>Voluntários</SectionTitle>
      <DataTable
        columns={volunteerColumns}
        rows={volunteers.data ?? []}
        loading={volunteers.isLoading}
        filename="voluntarios"
        emptyMessage="Nenhum voluntário cadastrado ainda."
      />
    </div>
  );
}
