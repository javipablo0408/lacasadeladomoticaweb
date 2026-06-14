import { Link } from "@/i18n/navigation";

export function Logo() {
  return (
    <Link href="/" className="group flex flex-col leading-none">
      <span className="text-[10px] font-light uppercase tracking-[0.25em] text-text-muted transition-colors group-hover:text-accent">
        La Casa de la
      </span>
      <span className="font-display text-xl font-semibold tracking-wide text-text">
        Domótica
      </span>
    </Link>
  );
}
