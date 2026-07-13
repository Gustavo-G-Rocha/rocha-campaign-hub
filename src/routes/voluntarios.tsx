import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createVolunteer } from "@/lib/campaign.functions";

export const Route = createFileRoute("/voluntarios")({
  head: () => ({
    meta: [
      { title: "Seja Voluntário — Willian Rocha" },
      {
        name: "description",
        content:
          "Cadastre-se como voluntário da campanha de Willian Rocha e ajude a transformar o nosso estado.",
      },
      { property: "og:title", content: "Seja Voluntário — Willian Rocha" },
      {
        property: "og:description",
        content: "Junte-se ao nosso time e faça a diferença na sua comunidade.",
      },
    ],
  }),
  component: Voluntarios,
});

function Voluntarios() {
  const submit = useServerFn(createVolunteer);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    try {
      const res = await submit({
        data: {
          nome: String(fd.get("nome") || ""),
          telefone: String(fd.get("telefone") || ""),
          email: String(fd.get("email") || ""),
          cidade: String(fd.get("cidade") || ""),
          bairro: String(fd.get("bairro") || ""),
          mensagem: String(fd.get("mensagem") || ""),
        },
      });
      if (res.ok) {
        toast.success("Cadastro realizado! Em breve entraremos em contato.");
        form.reset();
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="bg-brand-dark py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-display text-4xl uppercase text-brand-yellow md:text-5xl">
            Seja Voluntário
          </h1>
          <p className="mt-3 text-primary-foreground/80">
            Junte-se ao nosso time e faça a diferença na sua comunidade. Preencha o
            formulário e faça parte desta transformação.
          </p>
        </div>
      </section>

      <section className="bg-background py-12">
        <form
          onSubmit={handleSubmit}
          className="mx-auto grid max-w-2xl gap-5 px-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input id="nome" name="nome" required placeholder="Seu nome" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone / WhatsApp *</Label>
              <Input id="telefone" name="telefone" required placeholder="(41) 99999-9999" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="voce@email.com" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" name="cidade" placeholder="Sua cidade" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" name="bairro" placeholder="Seu bairro" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mensagem">Como quer ajudar?</Label>
            <Textarea id="mensagem" name="mensagem" rows={4} placeholder="Conte um pouco sobre você" />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-brand-dark font-bold uppercase tracking-wide text-brand-yellow hover:bg-brand-dark/90"
          >
            {loading ? "Enviando..." : "Quero ser voluntário"}
          </Button>
        </form>
      </section>
    </SiteLayout>
  );
}