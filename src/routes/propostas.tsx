import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/propostas")({
  head: () => ({
    meta: [
      { title: "Propostas — Willian Rocha" },
      {
        name: "description",
        content:
          "Conheça as propostas de Willian Rocha, candidato a Deputado Estadual pelo Paraná.",
      },
      { property: "og:title", content: "Propostas — Willian Rocha" },
      {
        property: "og:description",
        content: "As propostas de Willian Rocha para transformar o Paraná.",
      },
    ],
  }),
  component: Propostas,
});

type Proposta = {
  titulo: string;
  resumo: string;
  medidas: string[];
};

const propostas: Proposta[] = [
  {
    titulo: "Prendeu, Matou",
    resumo:
      "Programa de valorização da efetividade policial, com premiação financeira para agentes envolvidos na apreensão de drogas, captura de foragidos, prisão de traficantes e assaltantes, denúncia de corrupção interna e neutralização de criminosos que ameaçam a segurança do povo.",
    medidas: [
      "Ciclo Completo de Polícia: o agente que atende a ocorrência registra, colhe provas e encaminha direto ao Ministério Público/Judiciário, acabando com a burocracia dos cartórios.",
      "Meritocracia por resultados: premiação por metas — apreensão de armas e drogas, captura de foragidos, redução de homicídios e roubos, e combate à corrupção interna.",
      "Proteção jurídica ao policial e câmeras corporais obrigatórias como garantia de prova e defesa contra acusações falsas.",
      "Rigor penal: fim da progressão de regime, saidinhas e auxílio-reclusão para faccionados; regime fechado e isolamento de lideranças em presídios de segurança máxima.",
    ],
  },
  {
    titulo: "Fim da Máfia dos Ônibus",
    resumo:
      "Novo marco legal do transporte rodoviário intermunicipal para quebrar monopólios, abrir o mercado e permitir concorrência real entre empresas — reduzindo o preço das passagens, melhorando o serviço e encerrando o domínio de poucas concessionárias amigas do governo.",
    medidas: [
      "Abertura de mercado com regulação gerencial: fim dos contratos perpétuos ou direcionados, com metas de modicidade tarifária e frota limpa e renovada.",
      "Garantia de cobertura por subsídio cruzado transparente: linhas lucrativas financiam rotas sociais em municípios distantes e periféricos.",
      "Integração multimodal do transporte com a malha ferroviária e os hubs urbanos.",
      "Fiscalização digital pelo usuário: desempenho, horários e satisfação auditados em tempo real, servindo de critério para manter ou perder a outorga.",
    ],
  },
  {
    titulo: "Sem Esgoto, Sem Show",
    resumo:
      "Saneamento, saúde, educação e segurança pública passam a influenciar a prioridade e o valor dos recursos estaduais destinados à cultura e a grandes eventos. O município que abandona o básico não recebe prioridade para gastar dinheiro público com festa.",
    medidas: [
      "Ranking de prioridade: índice municipal de saneamento, saúde primária, evasão escolar e homicídios.",
      "Trava orçamentária: municípios que não atingem metas mínimas de esgoto e saúde ficam impedidos de receber verba estadual para shows e eventos.",
      "Redirecionamento: recursos retidos são convertidos em fundos para saneamento, tratamento de água e aparelhos de saúde e segurança.",
    ],
  },
  {
    titulo: "ICMS Anti Noia",
    resumo:
      "Modelo de distribuição de recursos inspirado no ICMS Educacional, premiando municípios com resultado real no enfrentamento à população em situação de rua ligada à dependência química, na internação involuntária e na retomada da ordem urbana. Cidade que combate o problema recebe mais apoio; cidade omissa perde recurso.",
    medidas: [
      "Ocupação territorial e requalificação urbana com tolerância zero à desordem e ao tráfico visível.",
      "Tecnologia e videomonitoramento, com Guardas Municipais transformadas em Polícias Municipais de ciclo completo.",
      "Reativação e modernização dos Hospitais de Custódia para tratamento de dependência crônica grave.",
      "Avaliação anual por redução de homicídios e roubos e reinserção de dependentes; alto desempenho ganha crédito e bônus de eficiência.",
    ],
  },
  {
    titulo: "Câmera Corporal em Agentes de Trânsito",
    resumo:
      "Obrigatoriedade do uso de câmeras corporais por agentes de trânsito estaduais e municipais. Se os policiais já usam equipamentos de gravação, os agentes de trânsito também devem atuar sob o mesmo padrão — mais proteção ao bom servidor, mais transparência e menos abuso de autoridade.",
    medidas: [
      "Bodycams integradas a um banco de dados unificado de ocorrências.",
      "Proteção e segurança jurídica do agente contra agressões, tentativas de suborno e falsas denúncias.",
      "Transparência do ato administrativo e um padrão único de ordem no trânsito urbano e rodoviário.",
    ],
  },
  {
    titulo: "CPI das Universidades Estaduais",
    resumo:
      "Comissão parlamentar de inquérito para investigar e apurar a atual situação das universidades estaduais, verificando eventuais violações de deveres institucionais e legais, abrindo caminho para reformas de gestão e cobrança de resultados.",
    medidas: [
      "Auditoria de desempenho e governança: relação custo/aluno, taxa de conclusão dos cursos e impacto das pesquisas.",
      "Repasses atrelados a metas de produtividade científica, inovação, patentes e empregabilidade dos egressos.",
      "Transparência radical dos gastos com folha de pagamento, supersalários e verbas de pesquisa em portais abertos.",
      "Foco na retenção de talentos e em P&D de ponta em parceria com a iniciativa privada.",
    ],
  },
  {
    titulo: "Paraná Tech Hub",
    resumo:
      "Atrair investimento tecnológico de alto valor, reduzir a fuga de talentos do Paraná e criar uma nova base econômica para Foz do Iguaçu e a região Oeste, menos dependente do turismo e do comércio de fronteira.",
    medidas: [
      "Contrapartidas das empresas beneficiadas: estágios, laboratórios, formação profissional, contratação local, infraestrutura e inovação aberta.",
      "Uso de imóveis estaduais para ambientes de inovação, mediante contrapartida obrigatória.",
      "Cautela ambiental com energia e recursos hídricos (relevante para data centers).",
      "Projeto de Lei estadual de diretrizes, sem criar despesa obrigatória, reduzindo o risco de inconstitucionalidade.",
    ],
  },
  {
    titulo: "Fortalecimento do BPFRON",
    resumo:
      "Fortalecer o Batalhão da Polícia Militar de Fronteira, integrando-o a um Sistema Integrado de Inteligência e Monitoramento de Fronteiras e dotando-o do Ciclo Completo de Polícia, como escudo da ordem e da propriedade do produtor rural no Oeste do Paraná.",
    medidas: [
      "Ciclo completo nas fronteiras: registro de termos, colheita imediata de provas e encaminhamento direto ao Ministério Público e ao Judiciário.",
      "Integração tecnológica: drones de longo alcance, sensores térmicos e reconhecimento facial conectados a Polícia Federal, Receita Federal e Forças Armadas em tempo real.",
      "Rede preventiva com produtores rurais e comunidades locais, apoiada por georreferenciamento e inteligência artificial.",
    ],
  },
  {
    titulo: "Smart Paraná",
    resumo:
      "Implantar no Paraná o modelo Smart Sampa — câmeras com inteligência artificial focadas em identificar foragidos e realizar prisões em flagrante — permitindo a identificação e a captura em tempo real no transporte público e nas vias públicas.",
    medidas: [
      "Guardas Civis transformadas em Polícias Municipais com ciclo completo para flagrantes e registros imediatos.",
      "Reconhecimento facial e análise preditiva alimentados por um cadastro unificado (dados estaduais, federais e de fronteira).",
      "Alertas automáticos e georreferenciados para antecipar ações criminosas.",
    ],
  },
];

function Propostas() {
  return (
    <SiteLayout>
      <section className="bg-brand-dark py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-display text-4xl uppercase text-brand-yellow md:text-5xl">
            Propostas
          </h1>
          <p className="mt-3 text-primary-foreground/80">
            Clique em cada proposta para ver os detalhes.
          </p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto max-w-3xl px-4">
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            {propostas.map((p, i) => (
              <AccordionItem
                key={p.titulo}
                value={p.titulo}
                className="overflow-hidden rounded-lg border bg-card shadow-sm data-[state=open]:border-brand-yellow"
              >
                <AccordionTrigger className="gap-4 px-5 py-5 hover:no-underline">
                  <span className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-dark font-display text-lg text-brand-yellow">
                      {i + 1}
                    </span>
                    <span className="font-display text-lg uppercase leading-tight text-brand-dark md:text-xl">
                      {p.titulo}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5">
                  <p className="text-base text-muted-foreground">{p.resumo}</p>
                  <ul className="mt-4 space-y-2">
                    {p.medidas.map((m, j) => (
                      <li key={j} className="flex gap-3 text-sm text-brand-dark/80">
                        <span
                          aria-hidden
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-yellow"
                        />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </SiteLayout>
  );
}
