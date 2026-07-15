import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { getEvents, type EventItem } from "@/lib/campaign.functions";

const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: () => getEvents(),
});

export const Route = createFileRoute("/eventos/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQuery),
  head: () => ({
    meta: [
      { title: "Eventos — Willian Rocha" },
      {
        name: "description",
        content:
          "Participe dos eventos e encontros da campanha de Willian Rocha. Veja onde estaremos.",
      },
      { property: "og:title", content: "Eventos — Willian Rocha" },
      {
        property: "og:description",
        content: "Veja onde estaremos e venha conversar conosco.",
      },
    ],
  }),
  component: Eventos,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Eventos() {
  const { data: events } = useSuspenseQuery(eventsQuery);

  return (
    <SiteLayout>
      <section className="bg-brand-dark py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-display text-4xl uppercase text-brand-yellow md:text-5xl">Eventos</h1>
          <p className="mt-3 text-primary-foreground/80">
            Participe dos nossos encontros e venha conversar conosco.
          </p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto max-w-4xl px-4">
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum evento agendado no momento. Volte em breve!
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <Link
      to="/eventos/$slug"
      params={{ slug: event.slug }}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className="relative h-36 bg-brand-dark bg-cover bg-center"
        style={event.imagem_url ? { backgroundImage: `url(${event.imagem_url})` } : undefined}
      >
        <div className="absolute inset-0 bg-brand-dark/50" />
        <Calendar className="absolute bottom-3 left-4 h-8 w-8 text-brand-yellow" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-display text-xl uppercase text-brand-dark">{event.titulo}</h2>
        {event.descricao && (
          <p className="mt-2 flex-1 text-sm text-muted-foreground">{event.descricao}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-dark/80">
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand-yellow" />
            {formatDate(event.data_evento)}
          </span>
          {(event.local || event.cidade) && (
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-yellow" />
              {[event.local, event.cidade].filter(Boolean).join(" — ")}
            </span>
          )}
        </div>

        <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-brand-dark group-hover:text-brand-yellow/90">
          Ver detalhes{" "}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
