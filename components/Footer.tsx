import Icon from "./ui/Icon";

export default function Footer() {
  return (
    <footer className="relative z-10 py-16">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ockno-logo.svg"
            alt="Ockno"
            className="h-6 w-auto"
          />
          <span className="text-sm text-muted-foreground">© 2026 Ockno, Inc.</span>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <a
            href="#compare"
            className="hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            vs Agency
          </a>
          <a
            href="#build"
            className="hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            FAQ
          </a>
          <a
            href="/privacy-policy"
            className="hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Terms
          </a>
          <a
            href="/privacy-policy#youtube-api-services"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <Icon icon="logos:youtube-icon" width={16} />
            YouTube Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
