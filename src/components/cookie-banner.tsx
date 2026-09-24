import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-consent";

export type CookieConsent = "all" | "essential";

// Use antes de carregar qualquer ferramenta opcional (analytics, pixel etc.).
export function getCookieConsent(): CookieConsent | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "all" || value === "essential" ? value : null;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  // Só decide no cliente para não divergir da renderização do servidor.
  useEffect(() => {
    setVisible(getCookieConsent() === null);
  }, []);

  function choose(value: CookieConsent) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // sem armazenamento: apenas fecha o aviso nesta visita
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-4 bottom-4 z-[60] rounded-lg border-2 border-brand-yellow bg-brand-dark p-5 text-primary-foreground shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-sm"
    >
      <div className="flex items-center gap-2">
        <Cookie className="h-6 w-6 text-brand-yellow" />
        <h2
          id="cookie-banner-title"
          className="font-display text-xl uppercase tracking-wide text-brand-yellow"
        >
          Cookies
        </h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-primary-foreground/85">
        Usamos cookies essenciais para o funcionamento do site e, com a sua permissão,
        cookies para entender como o site é usado. Saiba mais na nossa{" "}
        <Link to="/lgpd" className="font-semibold text-brand-yellow underline underline-offset-2">
          Política de Privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <Button
          onClick={() => choose("all")}
          className="flex-1 bg-brand-yellow font-bold uppercase tracking-wide text-brand-dark hover:bg-brand-yellow/90"
        >
          Aceitar
        </Button>
        <Button
          variant="outline"
          onClick={() => choose("essential")}
          className="flex-1 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          Só essenciais
        </Button>
      </div>
    </div>
  );
}
