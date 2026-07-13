import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import emblem from "@/assets/wr-emblem.png";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/voluntarios", label: "Voluntários" },
  { to: "/eventos", label: "Eventos" },
  { to: "/abaixo-assinados", label: "Abaixo-assinados" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-dark text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src={emblem} alt="Emblema Willian Rocha" width={32} height={32} className="h-8 w-8" />
          <span className="font-display text-xl tracking-wide">
            Willian <span className="text-brand-yellow">Rocha</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/80 transition-colors hover:text-brand-yellow"
              activeProps={{ className: "text-brand-yellow" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-brand-dark px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground/80 hover:text-brand-yellow"
              activeProps={{ className: "text-brand-yellow" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}