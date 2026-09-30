import { Link } from "@tanstack/react-router";

// Checkbox nativo com `required`: o navegador bloqueia o envio se não estiver marcado.
export function ConsentCheckbox() {
  return (
    <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
      <input
        type="checkbox"
        name="consentimento"
        required
        className="mt-1 h-4 w-4 shrink-0 accent-brand-dark"
      />
      <span>
        Li e concordo com a{" "}
        <Link
          to="/lgpd"
          target="_blank"
          className="font-semibold text-brand-dark underline underline-offset-2 hover:text-brand-yellow"
        >
          Política de Privacidade
        </Link>{" "}
        e autorizo o uso dos meus dados pela campanha, inclusive o compartilhamento com
        campanhas aliadas do meu estado. *
      </span>
    </label>
  );
}
