import { Link } from "@tanstack/react-router";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="bg-brand-dark text-primary-foreground/70">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-2xl text-primary-foreground">
              Willian <span className="text-brand-yellow">Rocha</span>
            </p>
            <p className="mt-1 text-sm">
              Pré-candidato a {siteConfig.cargo} — {siteConfig.cidade}
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/" className="hover:text-brand-yellow">Home</Link>
            <Link to="/voluntarios" className="hover:text-brand-yellow">Voluntários</Link>
            <Link to="/eventos" className="hover:text-brand-yellow">Eventos</Link>
            <Link to="/abaixo-assinados" className="hover:text-brand-yellow">Abaixo-assinados</Link>
          </nav>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-xs">
          © {new Date().getFullYear()} {siteConfig.candidato}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}