import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { FileSignature } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPetitions, signPetition, type PetitionItem } from "@/lib/campaign.functions";

const petitionsQuery = queryOptions({
  queryKey: ["petitions"],
  queryFn: () => getPetitions(),
});

export const Route = createFileRoute("/abaixo-assinados")({
  loader: ({ context }) => context.queryClient.ensureQueryData(petitionsQuery),
  head: () => ({
    meta: [
      { title: "Abaixo-assinados — Willian Rocha" },
      {
        name: "description",
        content:
          "Apoie as causas da campanha de Willian Rocha. Assine os abaixo-assinados e faça a diferença.",
      },
      { property: "og:title", content: "Abaixo-assinados — Willian Rocha" },
      {
        property: "og:description",
        content: "Assine e apoie as causas que vão transformar o nosso estado.",
      },
    ],
  }),
  component: AbaixoAssinados,
});

function AbaixoAssinados() {
  const { data: petitions } = useSuspenseQuery(petitionsQuery);

  return (
    <SiteLayout>
      <section className="bg-brand-dark py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-display text-4xl uppercase text-brand-yellow md:text-5xl">
            Abaixo-assinados
          </h1>
          <p className="mt-3 text-primary-foreground/80">
            Sua assinatura fortalece as causas que vão transformar o nosso estado.
          </p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto grid max-w-4xl gap-6 px-4 md:grid-cols-2">
          {petitions.map((p) => (
            <PetitionCard key={p.id} petition={p} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function PetitionCard({ petition }: { petition: PetitionItem }) {
  const queryClient = useQueryClient();
  const sign = useServerFn(signPetition);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pct = Math.min(100, Math.round((petition.assinaturas / petition.meta) * 100));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    try {
      const res = await sign({
        data: {
          slug: petition.slug,
          nome: String(fd.get("nome") || ""),
          email: String(fd.get("email") || ""),
          cidade: String(fd.get("cidade") || ""),
        },
      });
      if (res.ok) {
        toast.success("Assinatura registrada. Obrigado pelo apoio!");
        setOpen(false);
        form.reset();
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
    <article className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
      <FileSignature className="h-8 w-8 text-brand-yellow" />
      <h2 className="mt-3 font-display text-xl uppercase text-brand-dark">
        {petition.titulo}
      </h2>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{petition.descricao}</p>

      <div className="mt-4">
        <div className="flex justify-between text-sm font-semibold text-brand-dark">
          <span>{petition.assinaturas.toLocaleString("pt-BR")} assinaturas</span>
          <span className="text-muted-foreground">Meta: {petition.meta.toLocaleString("pt-BR")}</span>
        </div>
        <Progress value={pct} className="mt-2" />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mt-5 bg-brand-dark font-bold uppercase tracking-wide text-brand-yellow hover:bg-brand-dark/90">
            Assinar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display uppercase">{petition.titulo}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`nome-${petition.id}`}>Nome completo *</Label>
              <Input id={`nome-${petition.id}`} name="nome" required placeholder="Seu nome" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`email-${petition.id}`}>E-mail</Label>
              <Input id={`email-${petition.id}`} name="email" type="email" placeholder="voce@email.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`cidade-${petition.id}`}>Cidade</Label>
              <Input id={`cidade-${petition.id}`} name="cidade" placeholder="Sua cidade" />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-brand-dark font-bold uppercase tracking-wide text-brand-yellow hover:bg-brand-dark/90"
            >
              {loading ? "Enviando..." : "Confirmar assinatura"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </article>
  );
}