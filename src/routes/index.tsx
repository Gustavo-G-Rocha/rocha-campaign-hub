import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Users, Calendar, FileSignature } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { siteConfig } from "@/lib/site-config";
import heroImg from "@/assets/willian-hero.png";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section
        className="relative overflow-hidden hero-gradient"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="mx-auto grid max-w-6xl items-end gap-6 px-4 pt-12 md:grid-cols-2 md:pt-20">
          <div className="pb-10 md:pb-20">
            <h1 className="font-display text-6xl leading-[0.9] text-brand-dark md:text-8xl">
              WILLIAN
              <br />
              ROCHA
            </h1>
            <p className="mt-4 text-lg font-bold text-brand-dark md:text-xl">
              Pré-candidato a
            </p>
            <span className="mt-1 inline-block bg-brand-dark px-4 py-2 font-display text-2xl uppercase tracking-wide text-brand-yellow md:text-3xl">
              {siteConfig.cargo}
            </span>
            <p className="mt-6 max-w-md text-base text-brand-dark/80">
              {siteConfig.slogan}. Juntos, podemos construir um futuro melhor para todos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/voluntarios"
                className="inline-flex items-center gap-2 rounded-md bg-brand-dark px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-yellow transition-transform hover:scale-105"
              >
                Seja Voluntário <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/eventos"
                className="inline-flex items-center gap-2 rounded-md border-2 border-brand-dark px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-yellow"
              >
                Eventos
              </Link>
            </div>
          </div>
          <div className="flex items-end justify-center">
            <img
              src={heroImg}
              alt="Willian Rocha"
              width={1200}
              height={1500}
              className="max-h-[560px] w-auto object-contain drop-shadow-2xl"
            />
          </div>
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
