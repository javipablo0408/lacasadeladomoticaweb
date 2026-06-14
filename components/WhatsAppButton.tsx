import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-bg shadow-lg shadow-accent/20 transition-all duration-300 hover:scale-105 hover:bg-accent-hover"
      aria-label="WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
}
