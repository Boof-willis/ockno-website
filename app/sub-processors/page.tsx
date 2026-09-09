import type { Metadata } from "next";
import LegalShell, { H2, P, A } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Sub-processors | Ockno",
  description:
    "The third-party sub-processors Ockno uses to host and operate the service, what each one processes, and where.",
};

type Row = {
  name: string;
  purpose: string;
  data: string;
  location: string;
};

const INFRASTRUCTURE: Row[] = [
  {
    name: "Amazon Web Services",
    purpose: "Cloud hosting: application servers, database, file storage, content delivery, secrets management, and authentication",
    data: "All Customer Data",
    location: "United States (Oregon)",
  },
  {
    name: "Cloudflare",
    purpose: "DNS and TLS for customer custom domains on hosted pages",
    data: "Domain names and page traffic metadata",
    location: "Global edge network",
  },
];

const AI: Row[] = [
  {
    name: "Anthropic",
    purpose: "Large language models that power the Ockno assistant",
    data: "Questions sent to the assistant and the account context needed to answer them",
    location: "United States",
  },
  {
    name: "OpenAI",
    purpose: "Large language models that power the Ockno assistant",
    data: "Questions sent to the assistant and the account context needed to answer them",
    location: "United States",
  },
  {
    name: "Google",
    purpose: "Large language models that power the Ockno assistant",
    data: "Questions sent to the assistant and the account context needed to answer them",
    location: "United States",
  },
  {
    name: "fal.ai",
    purpose: "Image and video generation for ad creatives",
    data: "Ad images, prompts, and brand assets you choose to generate from",
    location: "United States",
  },
];

const MESSAGING: Row[] = [
  {
    name: "Mailgun",
    purpose: "Transactional and automation email delivery",
    data: "Recipient email addresses and message content",
    location: "United States",
  },
  {
    name: "Twilio",
    purpose: "SMS delivery and phone number provisioning",
    data: "Recipient phone numbers and message content",
    location: "United States",
  },
];

const OTHER: Row[] = [
  {
    name: "Stripe",
    purpose: "Subscription billing and payment processing",
    data: "Billing contact details and payment information",
    location: "United States",
  },
  {
    name: "DataForSEO",
    purpose: "Search volume and keyword data",
    data: "Keyword queries. No personal data",
    location: "United States",
  },
];

function Table({ rows }: { rows: Row[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm text-left">
        <thead className="bg-white/[0.03] text-muted-foreground text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 font-medium">Sub-processor</th>
            <th className="px-4 py-3 font-medium">Purpose</th>
            <th className="px-4 py-3 font-medium">Data processed</th>
            <th className="px-4 py-3 font-medium">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.name} className="align-top">
              <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">{r.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.purpose}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.data}</td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SubProcessors() {
  return (
    <LegalShell title="Sub-processors" lastUpdated="September 9, 2026">
      <section>
        <H2>Overview</H2>
        <P>
          Ockno uses a small number of third-party service providers
          (&quot;sub-processors&quot;) to host and operate the Services. Each
          sub-processor is bound by a written agreement that limits its use of
          Customer Data to the purpose listed below and requires security
          measures no less protective than our own. This page lists every
          sub-processor that may process Customer Data, what it processes, and
          where.
        </P>
        <P className="mt-4">
          Ockno&apos;s own production environment is hosted on Amazon Web
          Services in the United States (Oregon region). Customer Data is
          encrypted in transit and at rest. See our{" "}
          <A href="/privacy-policy">Privacy Policy</A> for how we collect, use,
          and retain information.
        </P>
      </section>

      <section>
        <H2>Infrastructure</H2>
        <Table rows={INFRASTRUCTURE} />
      </section>

      <section>
        <H2>AI models</H2>
        <P>
          The Ockno assistant answers questions and drafts content using large
          language models from the providers below. A request includes the
          question, the conversation it belongs to, and the parts of your account
          needed to answer it, such as campaign metrics or contact records you
          ask about. Anthropic, OpenAI, and Google do not use data sent through
          their APIs to train their models.
        </P>
        <Table rows={AI} />
      </section>

      <section>
        <H2>Messaging</H2>
        <Table rows={MESSAGING} />
      </section>

      <section>
        <H2>Billing and data</H2>
        <Table rows={OTHER} />
      </section>

      <section>
        <H2>Connected services</H2>
        <P>
          Services you connect to Ockno yourself, such as Google Ads, Meta,
          Slack, GoHighLevel, Stripe, Square, Calendly, Google Calendar, and
          YouTube, are not sub-processors. Data flows between Ockno and those
          services under your own account with that provider and only in the
          ways you configure. Disconnecting a service in Ockno stops that flow
          and deletes the stored access token immediately.
        </P>
      </section>

      <section>
        <H2>Changes to this list</H2>
        <P>
          We update this page before adding a new sub-processor or materially
          changing what an existing one processes. If you would like to be
          notified of changes, email us and we will add you to the notice list.
          If you object to a new sub-processor, you may terminate the affected
          Services under our Terms of Service.
        </P>
        <P className="mt-4">
          Questions about our sub-processors or data handling can be sent to{" "}
          <A href="mailto:hello@ockno.com">hello@ockno.com</A>.
        </P>
      </section>
    </LegalShell>
  );
}
