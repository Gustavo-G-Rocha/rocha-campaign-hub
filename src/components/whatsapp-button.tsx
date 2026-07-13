import { MessageCircle } from "lucide-react";
import { whatsappHref, siteConfig } from "@/lib/site-config";

export function WhatsappButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label={siteConfig.whatsappLabel}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}