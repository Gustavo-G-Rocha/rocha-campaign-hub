import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/lgpd")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade (LGPD) — Willian Rocha" },
      {
        name: "description",
        content:
          "Política de Privacidade e tratamento de dados pessoais da campanha de Willian Rocha, em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
      },
    ],
  }),
  component: Lgpd,
});

function Lgpd() {
  const atualizacao = "14 de julho de 2026";

  return (
    <SiteLayout>
      <section className="bg-brand-dark py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-display text-4xl uppercase text-brand-yellow md:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-primary-foreground/80">
            Tratamento de dados pessoais em conformidade com a Lei Geral de Proteção de
            Dados (Lei nº 13.709/2018 — LGPD).
          </p>
          <p className="mt-2 text-sm text-primary-foreground/60">
            Última atualização: {atualizacao}
          </p>
        </div>
      </section>

      <section className="bg-background py-14">
        <div className="mx-auto max-w-3xl space-y-10 px-4 text-foreground">
          <Bloco titulo="1. Quem é o responsável pelos seus dados">
            <p>
              Esta página é mantida pela campanha de <strong>{siteConfig.candidato}</strong>,
              pré-candidato a {siteConfig.cargo} pelo {siteConfig.cidade}. A campanha atua como
              <em> controladora</em> dos dados pessoais coletados neste site, decidindo sobre as
              finalidades e os meios de tratamento.
            </p>
          </Bloco>

          <Bloco titulo="2. Quais dados coletamos">
            <p>Coletamos apenas os dados que você nos fornece voluntariamente, por exemplo:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                <strong>Cadastro de voluntário:</strong> nome, telefone, e-mail, cidade, bairro
                e a mensagem que você optar por enviar.
              </li>
              <li>
                <strong>Apoio a causas e abaixo-assinados:</strong> nome, telefone, cidade e
                estado.
              </li>
              <li>
                <strong>Contato:</strong> os dados informados ao falar conosco por WhatsApp,
                e-mail ou redes sociais.
              </li>
            </ul>
            <p className="mt-3">
              Não coletamos intencionalmente dados sensíveis (como origem racial, convicção
              religiosa ou opinião política associada a uma pessoa identificada) além do que for
              estritamente necessário e informado no momento da coleta.
            </p>
          </Bloco>

          <Bloco titulo="3. Para que usamos seus dados">
            <ul className="list-disc space-y-1 pl-5">
              <li>Organizar e mobilizar a rede de voluntários da campanha;</li>
              <li>Comunicar eventos, ações e novidades da pré-candidatura;</li>
              <li>Registrar e contabilizar o apoio a causas e abaixo-assinados;</li>
              <li>Responder às suas mensagens e solicitações;</li>
              <li>Cumprir obrigações legais e eleitorais aplicáveis.</li>
            </ul>
          </Bloco>

          <Bloco titulo="4. Com base em que tratamos (bases legais)">
            <p>
              O tratamento se apoia nas hipóteses da LGPD, especialmente no{" "}
              <strong>consentimento</strong> fornecido por você ao preencher nossos formulários,
              no <strong>legítimo interesse</strong> da mobilização política e no{" "}
              <strong>cumprimento de obrigação legal ou regulatória</strong>.
            </p>
          </Bloco>

          <Bloco titulo="5. Compartilhamento">
            <p>
              Não vendemos seus dados. Podemos compartilhá-los com prestadores de serviço que
              apoiam a operação da campanha (por exemplo, hospedagem e ferramentas de
              comunicação), sempre limitados à finalidade informada, bem como com autoridades
              públicas quando exigido por lei.
            </p>
          </Bloco>

          <Bloco titulo="6. Por quanto tempo guardamos">
            <p>
              Mantemos seus dados apenas pelo tempo necessário às finalidades acima ou pelos
              prazos exigidos pela legislação eleitoral. Encerrado o tratamento, os dados são
              eliminados ou anonimizados.
            </p>
          </Bloco>

          <Bloco titulo="7. Seus direitos">
            <p>A qualquer momento, você pode solicitar:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>confirmação da existência de tratamento e acesso aos seus dados;</li>
              <li>correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>portabilidade e informação sobre compartilhamentos;</li>
              <li>revogação do consentimento e exclusão dos dados tratados com essa base.</li>
            </ul>
          </Bloco>

          <Bloco titulo="8. Como exercer seus direitos ou tirar dúvidas">
            <p>
              Fale com nosso encarregado de dados pelo e-mail{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-semibold text-brand-dark underline underline-offset-2 hover:text-brand-yellow"
              >
                {siteConfig.email}
              </a>
              . Responderemos sua solicitação no menor prazo possível.
            </p>
          </Bloco>

          <Bloco titulo="9. Alterações desta política">
            <p>
              Esta política pode ser atualizada a qualquer momento. A data da última revisão
              estará sempre indicada no topo desta página.
            </p>
          </Bloco>
        </div>
      </section>
    </SiteLayout>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl uppercase text-brand-dark">{titulo}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}
