import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brStates } from "@/lib/br-states";
import { getEventBySlug, registerEvent } from "@/lib/campaign.functions";

function eventQuery(slug: string) {
  return queryOptions({
    queryKey: ["events", slug],
    queryFn: () => getEventBySlug({ data: { slug } }),
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const Route = createFileRoute("/eventos/$slug")({
  loader: async ({ context, params }) => {
    const event = await context.queryClient.ensureQueryData(eventQuery(params.slug));
    if (!event) throw notFound();
    return event;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.titulo} — Willian Rocha` },
          ...(loaderData.descricao ? [{ name: "description", content: loaderData.descricao }] : []),
          { property: "og:title", content: `${loaderData.titulo} — Willian Rocha` },
          ...(loaderData.descricao
            ? [{ property: "og:description", content: loaderData.descricao }]
            : []),
        ]
      : [],
  }),
  component: EventPage,
});

function EventPage() {
  const { slug } = Route.useParams();
  const { data: event } = useSuspenseQuery(eventQuery(slug));
  const queryClient = useQueryClient();
  const register = useServerFn(registerEvent);
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  if (!event) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    try {
      const res = await register({
        data: {
          slug,
          nome: String(fd.get("nome") || ""),
          cidade: String(fd.get("cidade") || ""),
          estado,
          telefone: String(fd.get("telefone") || ""),
        },
      });
      if (res.ok) {
        toast.success("Inscrição confirmada. Nos vemos lá!");
        setRegistered(true);
        form.reset();
        setEstado("");
        queryClient.invalidateQueries({ queryKey: ["events"] });
      } else {
        toast.error(res.error ?? "Não foi possível inscrever.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao inscrever. Tente novamente.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      {/* TEMPLATE: só título e tema (descrição/local/data) mudam entre eventos — o fundo vem de event.imagem_url */}
      <section
        className="relative overflow-hidden bg-brand-dark bg-cover bg-center py-20"
        style={event.imagem_url ? { backgroundImage: `url(${event.imagem_url})` } : undefined}
      >
        <div className="absolute inset-0 bg-brand-dark/70" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <Link
            to="/eventos"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-foreground/70 hover:text-brand-yellow"
          >
            <ArrowLeft className="h-4 w-4" /> Todos os eventos
          </Link>
          <Calendar className="mx-auto mt-6 h-10 w-10 text-brand-yellow" />
          <h1 className="mt-4 font-display text-4xl uppercase text-brand-yellow md:text-5xl">
            {event.titulo}
          </h1>
          {event.descricao && <p className="mt-3 text-primary-foreground/90">{event.descricao}</p>}
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto max-w-xl px-4">
          <div className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm">
            <span className="inline-flex items-center gap-3 text-brand-dark">
              <Calendar className="h-5 w-5 text-brand-yellow" />
              {formatDate(event.data_evento)}
            </span>
            {(event.local || event.cidade) && (
              <span className="inline-flex items-center gap-3 text-brand-dark">
                <MapPin className="h-5 w-5 text-brand-yellow" />
                {[event.local, event.cidade].filter(Boolean).join(" — ")}
              </span>
            )}
            <span className="inline-flex items-center gap-3 text-brand-dark">
              <Users className="h-5 w-5 text-brand-yellow" />
              {event.inscritos.toLocaleString("pt-BR")}{" "}
              {event.inscritos === 1 ? "inscrito" : "inscritos"}
            </span>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-2xl uppercase text-brand-dark">Inscreva-se</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Confirme sua presença e receba as informações do evento.
            </p>
          </div>

          {registered ? (
            <div className="mt-6 rounded-lg border bg-card p-6 text-center shadow-sm">
              <h3 className="font-display text-xl uppercase text-brand-dark">
                Inscrição confirmada!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Obrigado por confirmar presença. Nos vemos no evento!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input id="nome" name="nome" required placeholder="Seu nome" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input id="cidade" name="cidade" required placeholder="Sua cidade" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Select value={estado} onValueChange={setEstado}>
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      {brStates.map((s) => (
                        <SelectItem key={s.uf} value={s.uf}>
                          {s.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone / WhatsApp *</Label>
                <Input id="telefone" name="telefone" required placeholder="(41) 99999-9999" />
              </div>
              <Button
                type="submit"
                disabled={loading || !estado}
                className="bg-brand-dark font-bold uppercase tracking-wide text-brand-yellow hover:bg-brand-dark/90"
              >
                {loading ? "Enviando..." : "Confirmar inscrição"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
