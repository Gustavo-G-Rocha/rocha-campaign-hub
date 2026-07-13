import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { getEvents } from "@/lib/campaign.functions";

const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: () => getEvents(),
});

export const Route = createFileRoute("/eventos")({
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
          <h1 className="font-display text-4xl uppercase text-brand-yellow md:text-5xl">
            Eventos
          </h1>
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
            <div className="grid gap-5">
              {events.map((ev) => (
                <article
                  key={ev.id}
                  className="rounded-lg border bg-card p-6 shadow-sm"
                >
                  <h2 className="font-display text-2xl uppercase text-brand-dark">
                    {ev.titulo}
                  </h2>
                  {ev.descricao && (
                    <p className="mt-2 text-muted-foreground">{ev.descricao}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-dark/80">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand-yellow" />
                      {formatDate(ev.data_evento)}
                    </span>
                    {(ev.local || ev.cidade) && (
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-brand-yellow" />
                        {[ev.local, ev.cidade].filter(Boolean).join(" — ")}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}