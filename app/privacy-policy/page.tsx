import type { Metadata } from "next";
import LegalShell, { H2, H3, P, UL, A, ContactBox } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy | Ockno",
  description:
    "Privacy Policy for Ockno - How we collect, use, and protect your information.",
};

export default function PrivacyPolicy() {
  return (
    <LegalShell title="Privacy Policy" lastUpdated="September 2, 2026">
      <section>
        <H2>Introduction</H2>
        <P>
          Ockno (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) provides an
          AI-operated platform for paid acquisition and the lead lifecycle —
          including campaign management, funnels, CRM, automations, and offline
          conversion tracking and attribution — for service businesses and
          agencies. This Privacy Policy explains how we collect, use, disclose,
          and protect your information when you use our platform, website, and
          related services (collectively, the &quot;Services&quot;).
        </P>
        <P className="mt-4">
          By using our Services, you agree to the collection and use of
          information in accordance with this policy.
        </P>
      </section>

      <section>
        <H2>Information We Collect</H2>

        <H3>Information You Provide</H3>
        <UL>
          <li>
            <strong className="text-white">Account Information:</strong> Name,
            email address, company name, phone number, and billing information
            when you create an account or subscribe to our Services.
          </li>
          <li>
            <strong className="text-white">CRM Data:</strong> Contact records,
            lead information, and disposition data that you choose to sync from
            your connected CRM (such as GoHighLevel).
          </li>
          <li>
            <strong className="text-white">Communications:</strong> Information
            you provide when contacting our support team or participating in
            surveys.
          </li>
        </UL>

        <H3>Information Collected Automatically</H3>
        <UL>
          <li>
            <strong className="text-white">Attribution Data:</strong> Google
            Click IDs (gclid), Facebook Click IDs (fbclid), UTM parameters,
            landing page URLs, referral sources, and campaign identifiers
            associated with your leads.
          </li>
          <li>
            <strong className="text-white">Usage Data:</strong> Log data, device
            information, browser type, IP address, pages visited, and features
            used within our platform.
          </li>
          <li>
            <strong className="text-white">Cookies and Tracking:</strong> We use
            cookies and similar technologies to maintain sessions, remember
            preferences, and analyze platform usage.
          </li>
        </UL>

        <H3>Information from Third Parties</H3>
        <UL>
          <li>
            <strong className="text-white">Integrated Platforms:</strong> Data
            from CRMs, advertising platforms (Google Ads, Meta), Google
            Analytics, Google Search Console, Google Calendar, Google Drive,
            YouTube, and other services you connect to Ockno. Our use of
            information received from Google APIs is described in the{" "}
            <strong className="text-white">Google API Services</strong> and{" "}
            <strong className="text-white">YouTube API Services</strong>{" "}
            sections below.
          </li>
          <li>
            <strong className="text-white">Service Providers:</strong>{" "}
            Information from payment processors and analytics providers.
          </li>
        </UL>
      </section>

      <section>
        <H2>How We Use Your Information</H2>
        <P className="mb-4">We use the information we collect to:</P>
        <UL>
          <li>Provide, operate, and maintain our Services</li>
          <li>
            Process and sync lead data between your CRM and advertising platforms
          </li>
          <li>
            Send offline conversion signals to Google Ads and Meta on your behalf
          </li>
          <li>
            Generate reports and analytics on lead performance and attribution
          </li>
          <li>Process payments and manage your subscription</li>
          <li>
            Communicate with you about updates, support, and promotional offers
          </li>
          <li>Improve and develop new features for our platform</li>
          <li>Detect, prevent, and address technical issues or fraud</li>
          <li>Comply with legal obligations</li>
        </UL>
      </section>

      <section>
        <H2>How We Share Your Information</H2>
        <P className="mb-4">
          We may share your information in the following circumstances:
        </P>
        <UL>
          <li>
            <strong className="text-white">With Advertising Platforms:</strong>{" "}
            We transmit conversion data (including attribution identifiers like
            gclid and fbclid) to Google Ads and Meta as directed by you to enable
            offline conversion tracking.
          </li>
          <li>
            <strong className="text-white">With Your Connected Services:</strong>{" "}
            Data flows between Ockno and your integrated CRM and advertising
            accounts based on your configuration.
          </li>
          <li>
            <strong className="text-white">With Service Providers:</strong> We
            work with third-party vendors for hosting, payment processing,
            analytics, and customer support who are bound by confidentiality
            obligations.
          </li>
          <li>
            <strong className="text-white">For Legal Compliance:</strong> When
            required by law, legal process, or to protect our rights, safety, or
            property.
          </li>
          <li>
            <strong className="text-white">Business Transfers:</strong> In
            connection with a merger, acquisition, or sale of assets, your
            information may be transferred to the acquiring entity.
          </li>
          <li>
            <strong className="text-white">With Your Consent:</strong> We may
            share information for other purposes with your explicit consent.
          </li>
        </UL>
        <P className="mt-4 font-semibold">
          We do not sell your personal information to third parties.
        </P>
      </section>

      <section id="google-api-services">
        <H2>Google API Services</H2>
        <P className="mb-4">
          Ockno connects to Google services only when you authorize a connection
          through Google sign-in (OAuth). Each connection requests only the
          permissions the feature you are enabling needs, and Google shows you
          those permissions before you approve them. The following applies to
          every Google connection:
        </P>
        <UL>
          <li>
            We store the OAuth tokens Google issues to us encrypted at rest and
            use them only to perform the actions described below on the account
            you connected
          </li>
          <li>
            We use information received from Google APIs only to provide and
            improve the feature you connected it for. We do not sell it, we do
            not use it for our own advertising, and we do not use it to train
            generalized artificial intelligence or machine learning models
          </li>
          <li>
            We do not share information received from Google APIs with third
            parties, except the infrastructure providers that host our platform
            under confidentiality obligations, or where required by law
          </li>
          <li>
            You can revoke Ockno&apos;s access at any time from your Google
            security settings (
            <A href="https://myaccount.google.com/permissions">
              https://myaccount.google.com/permissions
            </A>
            ) or by disconnecting the service inside Ockno. When a connection is
            disconnected or revoked, we delete the stored OAuth tokens for it
          </li>
        </UL>
        <P className="mt-4">
          Ockno&apos;s use and transfer to any other app of information received
          from Google APIs will adhere to the{" "}
          <A href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </A>
          , including the Limited Use requirements.
        </P>

        <H3>Google Ads</H3>
        <P className="mb-4">
          When you connect a Google Ads account, Ockno requests permission to
          see, edit, create, and delete Google Ads accounts and data. We use it
          to:
        </P>
        <UL>
          <li>
            Read the accounts you have access to, together with their campaigns,
            ad groups, ads, keywords, budgets, conversion actions, and
            performance metrics such as impressions, clicks, cost, and
            conversions
          </li>
          <li>
            Create, edit, pause, and remove campaigns, ad groups, ads, and
            conversion actions in your account when you, or the Ockno AI
            operator acting on your instructions, ask it to
          </li>
          <li>
            Store campaign identifiers and daily performance metrics so we can
            reconcile ad spend with the leads and revenue recorded in your CRM
            and show you attribution reporting
          </li>
          <li>
            Send offline conversion events (click identifiers, event time,
            conversion action, and value) back to your account so Google Ads can
            optimize toward the outcomes you care about
          </li>
        </UL>
        <P className="mt-4">
          For offline conversion uploads Ockno may also request permission to
          the Google Data Manager API. We use that permission solely to send
          conversion events to the Google Ads account you connected and to check
          the status of those uploads. We do not use it to read, import, or
          delete customer data in Google Analytics or Google Marketing Platform
          products.
        </P>

        <H3>Google Analytics and Google Search Console</H3>
        <P>
          When you connect Google Analytics or Google Search Console for SEO
          reporting, Ockno requests read-only access. We read the Analytics
          properties and Search Console sites you choose, along with their
          traffic, acquisition, and search performance reports (queries, pages,
          clicks, impressions, and average position), to show reporting and
          recommendations inside Ockno. We never modify your Analytics or Search
          Console configuration.
        </P>

        <H3>Google Calendar</H3>
        <P>
          When you connect Google Calendar for booking, Ockno reads your list of
          calendars and your free/busy availability to offer open times, and
          creates, updates, and cancels the booking events that are scheduled
          through Ockno, including Google Meet links for those events. We do not
          read the details of events that were not created through Ockno.
        </P>

        <H3>Google Drive</H3>
        <P>
          When you connect Google Drive, Ockno can only access files you
          individually select through the Google file picker and import them
          into your Ockno media library. We do not see, list, or access any
          other files in your Drive.
        </P>
      </section>

      <section id="youtube-api-services">
        <H2>YouTube API Services</H2>
        <P className="mb-4">
          Ockno uses YouTube API Services to let you upload video content from
          your Ockno media library to YouTube channels you own. When you connect
          a YouTube channel:
        </P>
        <UL>
          <li>
            We access and store your Google OAuth tokens (encrypted at rest) so
            we can perform uploads you request without asking you to sign in
            each time
          </li>
          <li>
            We access your channel&apos;s basic identifying information (channel
            ID and name) to confirm which channel you have connected
          </li>
          <li>
            We store the YouTube video IDs of videos uploaded through Ockno so
            they can be referenced in your advertising campaigns
          </li>
          <li>
            We do not access, collect, or store your YouTube viewing history,
            subscriptions, comments, or any content from other users&apos;
            channels
          </li>
          <li>
            We do not share data obtained through YouTube API Services with
            third parties, and we do not use it for advertising purposes of our
            own
          </li>
        </UL>
        <P className="mt-4">
          Information obtained through YouTube API Services is handled in
          accordance with the{" "}
          <A href="https://policies.google.com/privacy">
            Google Privacy Policy
          </A>
          . You can revoke Ockno&apos;s access to your YouTube data at any time
          via your Google security settings (
          <A href="https://myaccount.google.com/permissions">
            https://myaccount.google.com/permissions
          </A>
          ). Upon revocation or disconnection of your channel, we delete the
          stored OAuth tokens associated with it.
        </P>
      </section>

      <section>
        <H2>Data Retention</H2>
        <P>
          We retain your information for as long as your account is active or as
          needed to provide you Services. We also retain information as necessary
          to comply with legal obligations, resolve disputes, and enforce our
          agreements.
        </P>
        <P className="mt-4">
          Lead and attribution data synced through our platform is retained
          according to your subscription plan and settings. You may request
          deletion of your data at any time by contacting us.
        </P>
        <P className="mt-4">
          When you disconnect a Google service or revoke Ockno&apos;s access, we
          delete the stored OAuth tokens for that connection immediately. Data
          previously synced from that service (for example cached campaign
          performance metrics) is deleted within 30 days of the disconnection
          unless we are required to keep it by law.
        </P>
      </section>

      <section>
        <H2>Data Security</H2>
        <P className="mb-4">
          We implement industry-standard security measures to protect your
          information, including:
        </P>
        <UL>
          <li>Encryption of data in transit (TLS/SSL) and at rest</li>
          <li>Secure authentication and access controls</li>
          <li>Regular security assessments and monitoring</li>
          <li>Limited employee access to sensitive data</li>
        </UL>
        <P className="mt-4">
          While we strive to protect your information, no method of transmission
          or storage is 100% secure. We cannot guarantee absolute security.
        </P>
      </section>

      <section>
        <H2>Your Rights and Choices</H2>
        <P className="mb-4">
          Depending on your location, you may have the following rights:
        </P>
        <UL>
          <li>
            <strong className="text-white">Access:</strong> Request a copy of the
            personal information we hold about you.
          </li>
          <li>
            <strong className="text-white">Correction:</strong> Request
            correction of inaccurate or incomplete information.
          </li>
          <li>
            <strong className="text-white">Deletion:</strong> Request deletion of
            your personal information, subject to certain exceptions.
          </li>
          <li>
            <strong className="text-white">Portability:</strong> Request a
            portable copy of your data in a structured format.
          </li>
          <li>
            <strong className="text-white">Opt-Out:</strong> Unsubscribe from
            marketing communications at any time.
          </li>
          <li>
            <strong className="text-white">Restrict Processing:</strong> Request
            limitation of how we process your data in certain circumstances.
          </li>
        </UL>
        <P className="mt-4">
          To exercise these rights, please contact us at the information provided
          below.
        </P>
      </section>

      <section>
        <H2>California Privacy Rights</H2>
        <P>
          If you are a California resident, you have additional rights under the
          California Consumer Privacy Act (CCPA), including the right to know what
          personal information we collect, request deletion, and opt out of the
          sale of personal information. As noted above, we do not sell personal
          information.
        </P>
        <P className="mt-4">
          To make a request, contact us using the information below. We will
          verify your identity before processing your request.
        </P>
      </section>

      <section>
        <H2>International Data Transfers</H2>
        <P>
          Your information may be transferred to and processed in countries other
          than your own. We take appropriate safeguards to ensure your data is
          protected in accordance with this Privacy Policy and applicable law.
        </P>
      </section>

      <section>
        <H2>Children&apos;s Privacy</H2>
        <P>
          Our Services are not directed to individuals under the age of 18. We do
          not knowingly collect personal information from children. If you believe
          we have inadvertently collected such information, please contact us
          immediately.
        </P>
      </section>

      <section>
        <H2>Third-Party Links</H2>
        <P>
          Our Services may contain links to third-party websites or services. We
          are not responsible for the privacy practices of these external sites.
          We encourage you to review their privacy policies.
        </P>
      </section>

      <section>
        <H2>Changes to This Policy</H2>
        <P>
          We may update this Privacy Policy from time to time. We will notify you
          of material changes by posting the updated policy on our website and
          updating the &quot;Last Updated&quot; date. Your continued use of the
          Services after changes become effective constitutes acceptance of the
          revised policy.
        </P>
      </section>

      <section>
        <H2>Contact Us</H2>
        <P className="mb-4">
          If you have questions about this Privacy Policy or wish to exercise your
          rights, please contact us:
        </P>
        <ContactBox />
      </section>
    </LegalShell>
  );
}
