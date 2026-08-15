import type { Metadata } from "next";
import LegalShell, { H2, H3, P, UL, A, ContactBox } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Service | Ockno",
  description: "Terms of Service governing your use of the Ockno platform.",
};

export default function Terms() {
  return (
    <LegalShell title="Terms of Service" lastUpdated="August 15, 2026">
      <section>
        <H2>1. Agreement to Terms</H2>
        <P>
          These Terms of Service (&quot;Terms&quot;) constitute a legally binding
          agreement between you (&quot;you,&quot; &quot;your,&quot; or
          &quot;User&quot;) and Ockno (&quot;we,&quot; &quot;us,&quot;
          &quot;our,&quot; or &quot;Company&quot;) governing your access to and
          use of our website, platform, and related services (collectively, the
          &quot;Services&quot;).
        </P>
        <P className="mt-4">
          By accessing or using our Services, you agree to be bound by these
          Terms. If you do not agree to these Terms, you may not access or use the
          Services. If you are using the Services on behalf of a business or
          organization, you represent that you have authority to bind that entity
          to these Terms.
        </P>
      </section>

      <section>
        <H2>2. Description of Services</H2>
        <P className="mb-4">
          Ockno provides an AI-operated platform for paid acquisition and the lead
          lifecycle for businesses and marketing agencies. Our platform:
        </P>
        <UL>
          <li>
            Connects your customer relationship management (CRM) systems to
            advertising platforms such as Google Ads and Meta
          </li>
          <li>
            Captures and organizes attribution data including click IDs, UTM
            parameters, and campaign identifiers
          </li>
          <li>
            Enables you to track lead outcomes through disposition stages (New
            Lead, Qualified Lead, Converted Lead)
          </li>
          <li>
            Sends offline conversion signals back to advertising platforms to
            optimize campaign performance
          </li>
          <li>
            Provides reporting and analytics on lead performance and attribution
          </li>
          <li>
            Publishes your video creative to your connected YouTube channel for
            use in video advertising campaigns
          </li>
        </UL>
        <P className="mt-4">
          We reserve the right to modify, suspend, or discontinue any aspect of
          the Services at any time with reasonable notice.
        </P>
      </section>

      <section>
        <H2>3. Account Registration</H2>
        <P className="mb-4">
          To use certain features of the Services, you must create an account.
          When registering, you agree to:
        </P>
        <UL>
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and promptly update your account information</li>
          <li>Keep your login credentials secure and confidential</li>
          <li>Accept responsibility for all activities that occur under your account</li>
          <li>Notify us immediately of any unauthorized access or security breach</li>
        </UL>
        <P className="mt-4">
          We reserve the right to suspend or terminate accounts that contain
          inaccurate information or violate these Terms.
        </P>
      </section>

      <section>
        <H2>4. Agency and Sub-Account Structure</H2>
        <P className="mb-4">
          If you are an agency using our Services to manage client accounts:
        </P>
        <UL>
          <li>
            You are responsible for ensuring your clients&apos; compliance with
            these Terms
          </li>
          <li>
            You represent that you have obtained necessary authorizations from
            clients to connect their CRM and advertising accounts
          </li>
          <li>
            You are responsible for managing user access and permissions within
            your agency workspace
          </li>
          <li>
            Client data remains subject to the same protections and obligations
            outlined in these Terms and our Privacy Policy
          </li>
        </UL>
      </section>

      <section>
        <H2>5. Subscription and Payment</H2>

        <H3>Fees and Billing</H3>
        <UL>
          <li>
            Access to the Services requires a paid subscription unless otherwise
            specified
          </li>
          <li>
            Subscription fees are billed in advance on a monthly or annual basis
            depending on your selected plan
          </li>
          <li>
            All fees are non-refundable except as expressly stated in these Terms
            or required by law
          </li>
          <li>
            We may change pricing with 30 days&apos; notice; continued use after
            the effective date constitutes acceptance
          </li>
        </UL>

        <H3>Payment Terms</H3>
        <UL>
          <li>
            You authorize us to charge your designated payment method for all
            applicable fees
          </li>
          <li>
            If payment fails, we may suspend access to the Services until payment
            is received
          </li>
          <li>
            You are responsible for all taxes associated with your use of the
            Services
          </li>
        </UL>

        <H3>Cancellation</H3>
        <UL>
          <li>
            You may cancel your subscription at any time through your account
            settings or by contacting us
          </li>
          <li>Cancellation takes effect at the end of the current billing period</li>
          <li>
            Upon cancellation, you retain access until the end of your paid
            period, after which your access will be terminated
          </li>
        </UL>
      </section>

      <section>
        <H2>6. Acceptable Use</H2>
        <P className="mb-4">
          You agree to use the Services only for lawful purposes and in accordance
          with these Terms. You agree not to:
        </P>
        <UL>
          <li>Violate any applicable laws, regulations, or third-party rights</li>
          <li>Use the Services to transmit spam, malware, or other harmful content</li>
          <li>
            Attempt to gain unauthorized access to our systems or other users&apos;
            accounts
          </li>
          <li>Interfere with or disrupt the integrity or performance of the Services</li>
          <li>Reverse engineer, decompile, or disassemble any aspect of the Services</li>
          <li>
            Use automated means to access the Services except through our provided
            APIs
          </li>
          <li>
            Resell, sublicense, or redistribute the Services without our written
            consent
          </li>
          <li>
            Use the Services to collect, store, or process data in violation of
            privacy laws
          </li>
          <li>Misrepresent your identity or affiliation with any person or entity</li>
          <li>Upload or transmit data you do not have the right to use or share</li>
        </UL>
      </section>

      <section>
        <H2>7. Data and Privacy</H2>

        <H3>Your Data</H3>
        <P>
          You retain ownership of all data you submit to the Services (&quot;Your
          Data&quot;). By using the Services, you grant us a limited license to
          use, process, and transmit Your Data solely to provide the Services to
          you.
        </P>

        <H3>Data Processing</H3>
        <UL>
          <li>We process Your Data in accordance with our Privacy Policy</li>
          <li>
            You are responsible for ensuring you have appropriate rights and
            consents to share data with us
          </li>
          <li>
            You acknowledge that we transmit data to third-party advertising
            platforms (Google, Meta) as directed by your configuration
          </li>
        </UL>

        <H3>Data Protection</H3>
        <UL>
          <li>We implement reasonable security measures to protect Your Data</li>
          <li>You are responsible for maintaining appropriate backups of Your Data</li>
          <li>
            Upon termination, we will delete Your Data in accordance with our data
            retention policies unless legally required to retain it
          </li>
        </UL>
      </section>

      <section>
        <H2>8. Third-Party Integrations</H2>
        <P className="mb-4">
          The Services integrate with third-party platforms including CRMs and
          advertising networks. You acknowledge that:
        </P>
        <UL>
          <li>
            Third-party services are governed by their own terms of service and
            privacy policies
          </li>
          <li>
            We are not responsible for the availability, accuracy, or performance
            of third-party services
          </li>
          <li>Your use of integrated services must comply with their respective terms</li>
          <li>
            Changes to third-party APIs or policies may affect the functionality
            of our Services
          </li>
          <li>
            You are responsible for maintaining valid credentials and
            authorizations for connected accounts
          </li>
        </UL>

        <H3>YouTube API Services</H3>
        <P className="mb-4">
          The Services use YouTube API Services to upload video content to
          YouTube channels that you own and have connected to your account. By
          using these features, you acknowledge and agree that:
        </P>
        <UL>
          <li>
            You are agreeing to be bound by the{" "}
            <A href="https://www.youtube.com/t/terms">
              YouTube Terms of Service
            </A>
          </li>
          <li>
            Google&apos;s handling of your information is described in the{" "}
            <A href="https://policies.google.com/privacy">
              Google Privacy Policy
            </A>
          </li>
          <li>
            Uploads are made only to YouTube channels you have explicitly
            authorized through Google&apos;s OAuth consent process, and only when
            you initiate them
          </li>
          <li>
            You are responsible for ensuring that video content you upload
            complies with YouTube&apos;s Terms of Service and Community
            Guidelines
          </li>
          <li>
            You may revoke Ockno&apos;s access to your YouTube channel at any
            time through your Google security settings (
            <A href="https://myaccount.google.com/permissions">
              https://myaccount.google.com/permissions
            </A>
            ); revoking access disables YouTube upload features but does not
            affect videos already on your channel
          </li>
        </UL>
      </section>

      <section>
        <H2>9. Intellectual Property</H2>

        <H3>Our Property</H3>
        <P>
          The Services, including all software, designs, text, graphics, and other
          content created by us, are owned by Ockno and protected by intellectual
          property laws. These Terms do not grant you any rights to our
          trademarks, logos, or branding.
        </P>

        <H3>License to Use</H3>
        <P>
          Subject to these Terms, we grant you a limited, non-exclusive,
          non-transferable, revocable license to access and use the Services for
          your internal business purposes during your subscription period.
        </P>

        <H3>Feedback</H3>
        <P>
          If you provide suggestions, ideas, or feedback about the Services, you
          grant us the right to use such feedback without restriction or
          compensation to you.
        </P>
      </section>

      <section>
        <H2>10. Confidentiality</H2>
        <P>
          Each party agrees to maintain the confidentiality of the other
          party&apos;s confidential information and not to disclose it to third
          parties except as necessary to perform obligations under these Terms or
          as required by law. Confidential information does not include information
          that is publicly available, independently developed, or rightfully
          received from third parties.
        </P>
      </section>

      <section>
        <H2>11. Disclaimer of Warranties</H2>
        <P className="mb-4 uppercase font-semibold">
          The Services are provided &quot;as is&quot; and &quot;as available&quot;
          without warranties of any kind, express or implied, including but not
          limited to warranties of merchantability, fitness for a particular
          purpose, non-infringement, or accuracy.
        </P>
        <P className="mb-4">We do not warrant that:</P>
        <UL>
          <li>The Services will be uninterrupted, secure, or error-free</li>
          <li>Results obtained from the Services will be accurate or reliable</li>
          <li>The Services will meet your specific requirements or expectations</li>
          <li>Any errors in the Services will be corrected</li>
        </UL>
        <P className="mt-4">
          You acknowledge that conversion tracking and attribution involve
          multiple systems and variables beyond our control, and we cannot
          guarantee specific advertising outcomes or performance improvements.
        </P>
      </section>

      <section>
        <H2>12. Limitation of Liability</H2>
        <P className="mb-4 uppercase font-semibold">
          To the maximum extent permitted by law, Ockno and its officers,
          directors, employees, and agents shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages, including but
          not limited to loss of profits, data, revenue, business opportunities,
          or goodwill, arising out of or related to your use of the Services.
        </P>
        <P className="mb-4 uppercase font-semibold">
          Our total liability for any claims arising under these Terms shall not
          exceed the amount you paid to us in the twelve (12) months preceding the
          claim.
        </P>
        <P>
          Some jurisdictions do not allow the exclusion or limitation of certain
          damages, so some of the above limitations may not apply to you.
        </P>
      </section>

      <section>
        <H2>13. Indemnification</H2>
        <P className="mb-4">
          You agree to indemnify, defend, and hold harmless Ockno and its
          officers, directors, employees, agents, and affiliates from and against
          any claims, liabilities, damages, losses, and expenses (including
          reasonable attorneys&apos; fees) arising out of or related to:
        </P>
        <UL>
          <li>Your use of the Services</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any third-party rights, including privacy rights</li>
          <li>Your Data or any content you submit through the Services</li>
          <li>Your breach of any representations or warranties made herein</li>
        </UL>
      </section>

      <section>
        <H2>14. Termination</H2>
        <P className="mb-4">
          We may suspend or terminate your access to the Services immediately and
          without notice if:
        </P>
        <UL>
          <li>You breach any provision of these Terms</li>
          <li>You fail to pay applicable fees</li>
          <li>We are required to do so by law</li>
          <li>We discontinue the Services</li>
        </UL>
        <P className="mt-4 mb-4">Upon termination:</P>
        <UL>
          <li>Your right to access the Services ceases immediately</li>
          <li>We may delete Your Data after a reasonable retention period</li>
          <li>
            Provisions that by their nature should survive termination will remain
            in effect, including intellectual property rights, disclaimers,
            limitations of liability, and indemnification
          </li>
        </UL>
      </section>

      <section>
        <H2>15. Dispute Resolution</H2>

        <H3>Governing Law</H3>
        <P>
          These Terms shall be governed by and construed in accordance with the
          laws of the State of Utah, without regard to its conflict of law
          provisions.
        </P>

        <H3>Arbitration</H3>
        <P>
          Any dispute arising out of or relating to these Terms or the Services
          shall be resolved by binding arbitration in accordance with the rules of
          the American Arbitration Association. The arbitration shall take place in
          Salt Lake City, Utah, and the arbitrator&apos;s decision shall be final
          and binding.
        </P>

        <H3>Class Action Waiver</H3>
        <P>
          You agree that any dispute resolution proceedings will be conducted only
          on an individual basis and not in a class, consolidated, or
          representative action.
        </P>

        <H3>Exceptions</H3>
        <P>
          Either party may seek injunctive or other equitable relief in any court
          of competent jurisdiction to protect its intellectual property rights.
        </P>
      </section>

      <section>
        <H2>16. General Provisions</H2>
        <UL>
          <li>
            <strong className="text-white">Entire Agreement:</strong> These Terms,
            together with our Privacy Policy, constitute the entire agreement
            between you and Ockno regarding the Services.
          </li>
          <li>
            <strong className="text-white">Amendments:</strong> We may modify these
            Terms at any time by posting the revised version on our website.
            Material changes will be communicated with reasonable notice. Continued
            use after changes become effective constitutes acceptance.
          </li>
          <li>
            <strong className="text-white">Severability:</strong> If any provision
            of these Terms is found to be unenforceable, the remaining provisions
            shall continue in full force and effect.
          </li>
          <li>
            <strong className="text-white">Waiver:</strong> Our failure to enforce
            any right or provision of these Terms shall not constitute a waiver of
            such right or provision.
          </li>
          <li>
            <strong className="text-white">Assignment:</strong> You may not assign
            or transfer these Terms without our prior written consent. We may
            assign our rights and obligations without restriction.
          </li>
          <li>
            <strong className="text-white">Notices:</strong> We may provide notices
            to you via email, through the Services, or by posting on our website.
            You may contact us at the address provided below.
          </li>
          <li>
            <strong className="text-white">Force Majeure:</strong> We shall not be
            liable for any failure or delay in performance due to circumstances
            beyond our reasonable control.
          </li>
        </UL>
      </section>

      <section>
        <H2>17. Contact Information</H2>
        <P className="mb-4">
          If you have any questions about these Terms of Service, please contact
          us:
        </P>
        <ContactBox />
      </section>
    </LegalShell>
  );
}
