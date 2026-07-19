import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Users, Calendar, FileSignature } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { siteConfig } from "@/lib/site-config";
import heroCover from "@/assets/hero-cover.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="bg-brand-dark">
        <img
          src={heroCover}
          alt="Willian Rocha — Candidato a Deputado Estadual"
          width={1920}
          height={900}
          className="h-auto w-full"
        />
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-4 pb-12 pt-2">
          <Link
            to="/voluntarios"
            className="inline-flex items-center gap-2 rounded-md bg-brand-yellow px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-dark transition-transform hover:scale-105"
          >
            Seja Voluntário <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/doar"
            className="inline-flex items-center gap-2 rounded-md border-2 border-brand-yellow px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-yellow transition-colors hover:bg-brand-yellow hover:text-brand-dark"
          >
            Doar
          </Link>
        </div>
      </section>

      {/* CTA CARDS */}
      <section className="bg-brand-dark py-14">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          <FeatureCard
            to="/voluntarios"
            icon={Users}
            titulo="Seja Voluntário"
            texto="Junte-se ao nosso time e faça a diferença na sua comunidade."
          />
          <FeatureCard
            to="/eventos"
            icon={Calendar}
            titulo="Eventos"
            texto="Participe dos nossos encontros. Veja onde estaremos."
          />
          <FeatureCard
            to="/abaixo-assinados"
            icon={FileSignature}
            titulo="Abaixo-assinados"
            texto="Apoie as causas que vão transformar o nosso estado."
          />
        </div>
      </section>

      {/* SOBRE */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-3xl uppercase text-brand-dark md:text-4xl">
            Um compromisso com você
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Willian Rocha acredita em uma política de trabalho, presença e resultado.
            Nascido e criado no {siteConfig.cidade}, conhece de perto os desafios da
            nossa gente e se compromete a levar essas pautas para a Assembleia.
          </p>
        </div>
      </section>

    </SiteLayout>
  );
}

function FeatureCard({
  to,
  icon: Icon,
  titulo,
  texto,
}: {
  to: string;
  icon: typeof Users;
  titulo: string;
  texto: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-lg border border-white/10 bg-white/5 p-6 transition-colors hover:border-brand-yellow"
    >
      <Icon className="h-9 w-9 text-brand-yellow" />
      <h3 className="mt-4 font-display text-xl uppercase text-primary-foreground">
        {titulo}
      </h3>
      <p className="mt-2 text-sm text-primary-foreground/70">{texto}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-yellow">
        Saiba mais <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
