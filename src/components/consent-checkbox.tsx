import { Link } from "@tanstack/react-router";
import { siteConfig } from "@/lib/site-config";

// Dois consentimentos separados (LGPD arts. 8º §4 e 11, I): o primeiro é obrigatório
// para enviar o formulário; o de compartilhamento é opcional e começa desmarcado.
export function ConsentCheckbox() {
  return (
    <div className="space-y-3">
      <label className="flex items-start gap-3 rounded-md border border-brand-yellow/60 bg-brand-yellow/10 p-3 text-sm leading-relaxed text-foreground">
        <input
          type="checkbox"
          name="consentimento"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-brand-dark"
        />
        <span>
          Li a{" "}
          <Link
            to="/lgpd"
            target="_blank"
            className="font-semibold text-brand-dark underline underline-offset-2 hover:text-brand-yellow"
          >
            Política de Privacidade
          </Link>{" "}
          e <strong>consinto</strong> que a campanha de {siteConfig.candidato} trate os dados
          deste formulário, <strong>inclusive a informação de que apoio esta candidatura ou
          causa</strong> (dado sensível de opinião política), para as finalidades descritas na
          política. *
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          name="compartilhamento"
          className="mt-1 h-4 w-4 shrink-0 accent-brand-dark"
        />
        <span>
          <strong>Opcional:</strong> autorizo o compartilhamento do meu nome, telefone, e-mail,
          cidade e estado com as {siteConfig.compartilhamento}.
        </span>
      </label>
    </div>
  );
}
