import Footer from "./Footer";

export default function LegalShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Simple nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-page/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ockno-logo.svg"
              alt="Ockno"
              className="h-8 w-auto"
            />
          </a>
          <a
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
          >
            Back to Home
          </a>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24 min-h-screen bg-page">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Last Updated: {lastUpdated}
            </p>
          </div>

          <div className="max-w-none space-y-12">{children}</div>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* Small typographic helpers so the legal pages read cleanly */
export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold text-foreground mb-4">{children}</h2>;
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">{children}</h3>
  );
}

export function P({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-muted-foreground leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
      {children}
    </ul>
  );
}

export function ContactBox() {
  return (
    <div className="card-elevated p-6 space-y-2">
      <p className="text-foreground font-semibold">Ockno</p>
      <p className="text-muted-foreground">
        Email:{" "}
        <a
          href="mailto:admin@ockno.com"
          className="text-primary hover:text-primary-hover transition-colors"
        >
          admin@ockno.com
        </a>
      </p>
      <p className="text-muted-foreground">
        Website:{" "}
        <a
          href="https://www.ockno.com"
          className="text-primary hover:text-primary-hover transition-colors"
        >
          www.ockno.com
        </a>
      </p>
    </div>
  );
}
