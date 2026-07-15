import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, FileSignature } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Progress } from "@/components/ui/progress";
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
import { getPetitionBySlug, signPetition } from "@/lib/campaign.functions";

function petitionQuery(slug: string) {
  return queryOptions({
    queryKey: ["petitions", slug],
    queryFn: () => getPetitionBySlug({ data: { slug } }),
  });
}

export const Route = createFileRoute("/abaixo-assinados/$slug")({
  loader: async ({ context, params }) => {
    const petition = await context.queryClient.ensureQueryData(petitionQuery(params.slug));
    if (!petition) throw notFound();
    return petition;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.titulo} — Willian Rocha` },
          { name: "description", content: loaderData.descricao },
          { property: "og:title", content: `${loaderData.titulo} — Willian Rocha` },
          { property: "og:description", content: loaderData.descricao },
        ]
      : [],
  }),
  component: PetitionPage,
});

function PetitionPage() {
  const { slug } = Route.useParams();
  const { data: petition } = useSuspenseQuery(petitionQuery(slug));
  const queryClient = useQueryClient();
  const sign = useServerFn(signPetition);
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(false);

  if (!petition) return null;

  const pct = Math.min(100, Math.round((petition.assinaturas / petition.meta) * 100));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    try {
      const res = await sign({
        data: {
          slug,
          nome: String(fd.get("nome") || ""),
          cidade: String(fd.get("cidade") || ""),
          estado,
          telefone: String(fd.get("telefone") || ""),
        },
      });
      if (res.ok) {
        toast.success("Assinatura registrada. Obrigado pelo apoio!");
        setSigned(true);
        form.reset();
        setEstado("");
        queryClient.invalidateQueries({ queryKey: ["petitions"] });
      } else {
        toast.error(res.error ?? "Não foi possível assinar.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao assinar. Tente novamente.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      {/* TEMPLATE: só título e tema (descrição) mudam entre abaixo-assinados — o fundo vem de petition.imagem_url */}
      <section
        className="relative overflow-hidden bg-brand-dark bg-cover bg-center py-20"
        style={petition.imagem_url ? { backgroundImage: `url(${petition.imagem_url})` } : undefined}
      >
        <div className="absolute inset-0 bg-brand-dark/70" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <Link
            to="/abaixo-assinados"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-foreground/70 hover:text-brand-yellow"
          >
            <ArrowLeft className="h-4 w-4" /> Todos os abaixo-assinados
          </Link>
          <FileSignature className="mx-auto mt-6 h-10 w-10 text-brand-yellow" />
          <h1 className="mt-4 font-display text-4xl uppercase text-brand-yellow md:text-5xl">
            {petition.titulo}
          </h1>
          <p className="mt-3 text-primary-foreground/90">{petition.descricao}</p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto max-w-xl px-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex justify-between text-sm font-semibold text-brand-dark">
              <span>{petition.assinaturas.toLocaleString("pt-BR")} assinaturas</span>
              <span className="text-muted-foreground">
                Meta: {petition.meta.toLocaleString("pt-BR")}
              </span>
            </div>
            <Progress value={pct} className="mt-2" />
          </div>

          {signed ? (
            <div className="mt-8 rounded-lg border bg-card p-6 text-center shadow-sm">
              <h2 className="font-display text-xl uppercase text-brand-dark">
                Assinatura confirmada!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Obrigado por apoiar esta causa. Compartilhe com quem também precisa assinar.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
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
                {loading ? "Enviando..." : "Confirmar assinatura"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
