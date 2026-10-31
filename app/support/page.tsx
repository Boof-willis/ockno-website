import type { Metadata } from "next";
import LegalShell, { H2, P, UL, A } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Support | Ockno",
  description:
    "How to reach Ockno, and answers to common questions about the Ockno web app and iPhone app.",
};

const EMAIL = "hello@ockno.com";

export default function Support() {
  return (
    <LegalShell title="Support">
      <section>
        <H2>Contact us</H2>
        <P>
          Email <A href={`mailto:${EMAIL}`}>{EMAIL}</A> with your name, the
          business you use Ockno for, and what you need help with. A person on
          our team will reply by email.
        </P>
      </section>

      <section>
        <H2>Signing in</H2>
        <UL>
          <li>
            Ockno accounts are created on the web at{" "}
            <A href="https://app.ockno.com">app.ockno.com</A>, or when someone on
            your team invites you. The iPhone app signs in to an account you
            already have; it does not create new ones.
          </li>
          <li>
            Sign in with the email and password you use on the web, or with
            Continue with Google if that is how your account was set up.
          </li>
          <li>
            Forgot your password? Reset it at{" "}
            <A href="https://app.ockno.com">app.ockno.com</A>, then sign in on
            your phone with the new one.
          </li>
        </UL>
      </section>

      <section>
        <H2>Notifications on your iPhone</H2>
        <UL>
          <li>
            To turn notifications on or off, open the iPhone Settings app, tap
            Notifications, then tap Ockno.
          </li>
          <li>
            To choose which alerts reach your phone, open Settings in the Ockno
            app and switch each kind of alert on or off.
          </li>
          <li>Email and Slack alerts are set in Ockno on the web.</li>
        </UL>
      </section>

      <section>
        <H2>Calls and texts</H2>
        <P>
          Calling and texting from Ockno use a business phone number that your
          workspace sets up. If you can&apos;t place a call or send a text, ask
          a workspace admin to add a number or give you access to one.
        </P>
        <P className="mt-4">
          The app asks to use your microphone the first time you make or take a
          call. If you said no, turn it back on in the iPhone Settings app under
          Ockno.
        </P>
      </section>

      <section>
        <H2>Deleting your account</H2>
        <P>
          In the iPhone app, open Settings and tap Delete account, or email us
          and we will do it for you. Your sign-in and profile are deleted right
          away. Records you added to a business, such as contacts and
          appointments, belong to that business&apos;s workspace and stay with
          it. If you are the only owner of an organization, the app sends your
          request to our team, who finish it and email you when it is done.
        </P>
        <P className="mt-4">
          Our <A href="/privacy-policy">Privacy Policy</A> explains what Ockno
          collects and how it is used.
        </P>
      </section>
    </LegalShell>
  );
}
