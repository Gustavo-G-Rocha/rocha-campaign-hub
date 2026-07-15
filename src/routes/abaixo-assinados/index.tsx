import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { FileSignature, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Progress } from "@/components/ui/progress";
import { getPetitions, type PetitionItem } from "@/lib/campaign.functions";

const petitionsQuery = queryOptions({
  queryKey: ["petitions"],
  queryFn: () => getPetitions(),
});

export const Route = createFileRoute("/abaixo-assinados/")({
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
  const pct = Math.min(100, Math.round((petition.assinaturas / petition.meta) * 100));

  return (
    <Link
      to="/abaixo-assinados/$slug"
      params={{ slug: petition.slug }}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className="relative h-36 bg-brand-dark bg-cover bg-center"
        style={petition.imagem_url ? { backgroundImage: `url(${petition.imagem_url})` } : undefined}
      >
        <div className="absolute inset-0 bg-brand-dark/50" />
        <FileSignature className="absolute bottom-3 left-4 h-8 w-8 text-brand-yellow" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-display text-xl uppercase text-brand-dark">{petition.titulo}</h2>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{petition.descricao}</p>

        <div className="mt-4">
          <div className="flex justify-between text-sm font-semibold text-brand-dark">
            <span>{petition.assinaturas.toLocaleString("pt-BR")} assinaturas</span>
            <span className="text-muted-foreground">
              Meta: {petition.meta.toLocaleString("pt-BR")}
            </span>
          </div>
          <Progress value={pct} className="mt-2" />
        </div>

        <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-brand-dark group-hover:text-brand-yellow/90">
          Assinar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
