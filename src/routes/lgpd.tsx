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

const link = "font-semibold text-brand-dark underline underline-offset-2 hover:text-brand-yellow";

function Lgpd() {
  const atualizacao = "30 de setembro de 2026";

  return (
    <SiteLayout>
      <section className="bg-brand-dark py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-display text-4xl uppercase text-brand-yellow md:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-primary-foreground/80">
            Tratamento de dados pessoais em conformidade com a Lei Geral de Proteção de Dados
            (Lei nº 13.709/2018 — LGPD) e com a Resolução TSE nº 23.610/2019.
          </p>
          <p className="mt-2 text-sm text-primary-foreground/60">
            Última atualização: {atualizacao}
          </p>
        </div>
      </section>

      <section className="bg-background py-14">
        <div className="mx-auto max-w-3xl space-y-10 px-4 text-foreground">
          <Bloco titulo="1. Quem é o responsável pelos seus dados (controlador)">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Controlador:</strong> Eleição 2026 {siteConfig.nomeCompleto} –{" "}
                {siteConfig.cargo}, candidato pelo {siteConfig.partido} ({siteConfig.numero}).
              </li>
              <li>
                <strong>CNPJ da candidatura:</strong> {siteConfig.cnpjComite}
              </li>
              <li>
                <strong>Localização:</strong> {siteConfig.sede}
              </li>
              <li>
                <strong>Contato:</strong>{" "}
                <a href={`mailto:${siteConfig.email}`} className={link}>
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </Bloco>

          <Bloco titulo="2. Quais dados coletamos">
            <p>Coletamos apenas os dados que você nos fornece voluntariamente:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                <strong>Cadastro de voluntário:</strong> nome, telefone, e-mail, cidade, bairro e
                a mensagem que você optar por enviar.
              </li>
              <li>
                <strong>Inscrição em eventos e assinatura de abaixo-assinados:</strong> nome,
                telefone, cidade e estado.
              </li>
              <li>
                <strong>Contato:</strong> os dados informados ao falar conosco por WhatsApp,
                e-mail ou redes sociais.
              </li>
              <li>
                <strong>Pedidos de material (serviço encerrado):</strong> nome, telefone e
                endereço de entrega informados na antiga página de pedidos de material, que não
                está mais disponível. Esses dados não são usados para outra finalidade e serão
                eliminados no prazo do item 7.
              </li>
            </ul>
            <p className="mt-3">
              <strong>Dado sensível:</strong> ao se cadastrar como voluntário, se inscrever em um
              evento ou assinar um abaixo-assinado da campanha, você revela apoio a esta
              candidatura ou causa, o que é <strong>opinião política</strong> — dado pessoal
              sensível (LGPD, art. 5º, II). Por isso, esse tratamento só ocorre com o seu{" "}
              <strong>consentimento específico e destacado</strong>, dado na caixa obrigatória de
              cada formulário (LGPD, art. 11, I).
            </p>
          </Bloco>

          <Bloco titulo="3. Para que usamos seus dados">
            <ul className="list-disc space-y-1 pl-5">
              <li>Organizar e mobilizar a rede de voluntários da campanha;</li>
              <li>Comunicar eventos, ações e novidades da candidatura;</li>
              <li>Registrar e contabilizar o apoio a causas e abaixo-assinados;</li>
              <li>Responder às suas mensagens e solicitações;</li>
              <li>Cumprir obrigações legais e eleitorais aplicáveis.</li>
            </ul>
          </Bloco>

          <Bloco titulo="4. Com base em que tratamos (bases legais)">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Consentimento específico e destacado</strong> (art. 11, I) para os dados
                dos formulários, que revelam opinião política;
              </li>
              <li>
                <strong>Consentimento</strong> separado e opcional (art. 7º, I) para o
                compartilhamento descrito no item 5;
              </li>
              <li>
                <strong>Cumprimento de obrigação legal ou regulatória</strong> (arts. 7º, II e 11,
                II, "a"), como as exigências da Justiça Eleitoral.
              </li>
            </ul>
            <p>Não usamos o legítimo interesse como base para dados de opinião política.</p>
          </Bloco>

          <Bloco titulo="5. Compartilhamento">
            <p>
              Não vendemos seus dados. Eles podem ser acessados por prestadores de serviço que
              operam o site em nosso nome (hospedagem, banco de dados, e-mail e rede de
              distribuição), sempre limitados à finalidade informada, e por autoridades públicas
              quando exigido por lei.
            </p>
            <p>
              <strong>Somente se você marcar a caixa opcional</strong> no formulário, seu nome,
              telefone, e-mail, cidade e estado poderão ser compartilhados com as{" "}
              <strong>{siteConfig.compartilhamento}</strong>, para comunicação de eventos e ações
              de campanha. Se não marcar, seus dados ficam apenas com esta campanha. Você pode
              revogar essa autorização a qualquer momento pelo contato do item 9.
            </p>
            <p>
              <strong>Doações:</strong> são feitas diretamente na plataforma Quero Apoiar, que é{" "}
              <strong>controladora independente</strong> dos dados de quem doa e segue a sua
              própria política de privacidade. A campanha recebe apenas as informações exigidas
              para a prestação de contas à Justiça Eleitoral.
            </p>
          </Bloco>

          <Bloco titulo="6. Transferência internacional">
            <p>
              Alguns fornecedores que usamos — como Cloudflare (rede de distribuição e
              estatísticas de acesso), Google (e-mail) e o provedor de hospedagem do site — podem
              armazenar ou processar dados em servidores fora do Brasil. Essas transferências
              ocorrem com base nas garantias contratuais desses fornecedores, nos termos do art.
              33 da LGPD.
            </p>
          </Bloco>

          <Bloco titulo="7. Por quanto tempo guardamos">
            <p>
              Os dados coletados pela campanha são mantidos até{" "}
              <strong>180 dias após a diplomação dos eleitos</strong> nas Eleições 2026. Depois
              disso, são eliminados ou anonimizados, salvo quando a lei exigir a guarda por mais
              tempo (por exemplo, registros da prestação de contas eleitoral). Se você revogar o
              consentimento antes, seus dados são eliminados assim que o pedido for atendido.
            </p>
          </Bloco>

          <Bloco titulo="8. Seus direitos">
            <p>A qualquer momento, você pode solicitar (LGPD, art. 18):</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>confirmação da existência de tratamento e acesso aos seus dados;</li>
              <li>correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>portabilidade e informação sobre com quem seus dados foram compartilhados;</li>
              <li>revogação do consentimento e eliminação dos dados tratados com essa base.</li>
            </ul>
            <p>
              Pedidos de acesso completo são respondidos em até <strong>15 dias</strong> (art.
              19, II). Se não ficar satisfeito, você pode reclamar à{" "}
              <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong>, pelo site{" "}
              <a href="https://www.gov.br/anpd" target="_blank" rel="noreferrer" className={link}>
                gov.br/anpd
              </a>
              .
            </p>
          </Bloco>

          <Bloco titulo="9. Encarregado de dados e contato">
            <p>
              Nosso encarregado pelo tratamento de dados pessoais é{" "}
              <strong>{siteConfig.encarregado}</strong>, que atende pelo e-mail{" "}
              <a href={`mailto:${siteConfig.email}`} className={link}>
                {siteConfig.email}
              </a>
              .
            </p>
          </Bloco>

          <Bloco titulo="10. Mensagens por WhatsApp e e-mail">
            <p>
              Só enviamos mensagens de campanha a quem forneceu o contato. Toda mensagem traz a
              opção de <strong>deixar de recebê-las</strong>, e o pedido de descadastramento é
              atendido em até <strong>48 horas</strong> (Resolução TSE nº 23.610/2019). Você
              também pode pedir pelo e-mail do item 9.
            </p>
          </Bloco>

          <Bloco titulo="11. Cookies e estatísticas">
            <p>
              Usamos cookies essenciais, necessários para o funcionamento do site (por exemplo,
              para manter o acesso à área administrativa). Cookies opcionais só são usados se
              você clicar em <strong>Aceitar</strong> no aviso de cookies. O site também usa o{" "}
              <strong>Cloudflare Web Analytics</strong>, que mede visitas de forma agregada, sem
              cookies e sem identificar você.
            </p>
            <p>
              Você pode mudar sua escolha a qualquer momento pelo link{" "}
              <strong>Preferências de cookies</strong>, no rodapé de todas as páginas.
            </p>
          </Bloco>

          <Bloco titulo="12. Alterações desta política">
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
