import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, ExternalLink } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { siteConfig } from "@/lib/site-config";
import qrCode from "@/assets/doar-qrcode.png";

export const Route = createFileRoute("/doar")({
  head: () => ({
    meta: [
      { title: "Doar — Willian Rocha" },
      {
        name: "description",
        content:
          "Apoie a campanha de Willian Rocha com uma doação. Escaneie o QR Code ou acesse o link seguro do Quero Apoiar.",
      },
      { property: "og:title", content: "Doar — Willian Rocha" },
      {
        property: "og:description",
        content: "Apoie a campanha de Willian Rocha com uma doação segura pelo Quero Apoiar.",
      },
    ],
  }),
  component: Doar,
});

function Doar() {
  return (
    <SiteLayout>
      <section className="bg-brand-dark py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <HeartHandshake className="mx-auto h-10 w-10 text-brand-yellow" />
          <h1 className="mt-4 font-display text-4xl uppercase text-brand-yellow md:text-5xl">
            Doar
          </h1>
          <p className="mt-3 text-primary-foreground/80">
            Sua contribuição ajuda a levar essa campanha mais longe. Toda doação é processada de
            forma segura pelo Quero Apoiar.
          </p>
        </div>
      </section>

      {siteConfig.doarEmbedUrl && (
        <section className="bg-background pt-12">
          <div className="mx-auto max-w-md px-6">
            <iframe
              src={siteConfig.doarEmbedUrl}
              title="Contador de doações — Quero Apoiar"
              className="h-40 w-full rounded-lg border"
              loading="lazy"
            />
          </div>
        </section>
      )}

      <section className="bg-background py-12">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-lg border bg-card px-6 py-10 text-center shadow-sm">
          <img
            src={qrCode}
            alt="QR Code para doação — queroapoiar.com.br/willianrocha"
            width={330}
            height={330}
            className="h-56 w-56 rounded-md border md:h-64 md:w-64"
          />
          <p className="text-sm text-muted-foreground">
            Aponte a câmera do celular para o QR Code acima ou clique no botão abaixo.
          </p>
          <a
            href={siteConfig.doarUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-brand-dark px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-yellow transition-transform hover:scale-105"
          >
            Doar agora <ExternalLink className="h-4 w-4" />
          </a>
          <p className="break-all text-xs text-muted-foreground">{siteConfig.doarUrl}</p>
        </div>
      </section>
    </SiteLayout>
  );
}
