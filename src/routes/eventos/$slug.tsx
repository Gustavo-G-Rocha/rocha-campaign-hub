import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";

import { getEventBySlug } from "@/lib/campaign.functions";

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

  if (!event) return null;

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
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
