import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-6xl font-light text-text">404</h1>
      <p className="mt-4 text-text-muted">Página no encontrada</p>
      <Link
        href="/"
        className="mt-8 text-sm tracking-wide text-accent transition-colors hover:text-accent-hover"
      >
        Volver al inicio →
      </Link>
    </section>
  );
}
