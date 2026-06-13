import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Geiger Studios collects, uses, shares, retains, and protects personal data.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Geiger Studios",
    description:
      "How Geiger Studios collects, uses, shares, retains, and protects personal data.",
    url: "/privacy",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Geiger Studios",
    description: "How Geiger Studios handles personal data.",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      summary="This policy explains what personal data Geiger Studios processes, why we process it, who helps us provide the services, and the choices available to you."
      updated="June 13, 2026"
    >
      <h2>1. Who we are</h2>
      <p>
        Geiger Studios (“Geiger”, “we”, “us”, or “our”) operates geiger.studio
        and the connected Geiger products, including Notes, Flow, Assets,
        Canvas, Forms, Events, Office, Content, Campaign, Chat, Grey, and Docs.
        For privacy questions or requests, contact{" "}
        <a href="mailto:privacy@geiger.studio">privacy@geiger.studio</a>.
      </p>

      <h2>2. Scope</h2>
      <p>
        This policy applies when you visit our public websites, create or use a
        Geiger account, use our hosted products, contact us, or otherwise
        interact with the services. It does not govern third-party websites or
        services that have their own privacy policies.
      </p>

      <h2>3. Data we process</h2>
      <ul>
        <li>
          <strong>Account data:</strong> email address, display name, profile
          image, authentication identifiers, preferences, and account settings.
        </li>
        <li>
          <strong>Workspace content:</strong> notes, boards, projects,
          documents, forms, messages, uploaded files, metadata, comments, and
          other material you choose to store or share through Geiger.
        </li>
        <li>
          <strong>Usage and device data:</strong> pages viewed, product and tool
          actions, referral information, browser type, device type, approximate
          region, timestamps, diagnostics, and security logs.
        </li>
        <li>
          <strong>Communications:</strong> information included in support,
          privacy, sales, or other messages you send to us.
        </li>
        <li>
          <strong>Transaction data:</strong> plan, billing status, and payment
          references when paid services are offered. Payment card details are
          processed by the payment provider and are not intended to be stored by
          Geiger.
        </li>
      </ul>

      <h2>4. Browser-based image tools</h2>
      <p>
        The public image crop, resize, compression, and conversion tools process
        selected images locally in your browser. Geiger does not upload the
        image contents or filenames for these operations. We may record
        privacy-reduced events such as the tool used, broad file-size range,
        input type, output format, completion, and download actions.
      </p>

      <h2>5. How and why we use data</h2>
      <ul>
        <li>Provide, maintain, secure, and troubleshoot the services.</li>
        <li>Authenticate users and preserve account and workspace settings.</li>
        <li>Process files and content at your direction.</li>
        <li>Measure product usage and improve usability and performance.</li>
        <li>Respond to requests and send service-related communications.</li>
        <li>Prevent fraud, abuse, security incidents, and unlawful activity.</li>
        <li>Comply with legal obligations and enforce our agreements.</li>
      </ul>
      <p>
        Depending on applicable law, we process data to perform our contract
        with you, with your consent, to meet legal obligations, and for
        legitimate interests such as operating and securing the services.
      </p>

      <h2>6. Analytics and cookies</h2>
      <p>
        We use PostHog for limited product and traffic measurement. Our current
        configuration is cookieless, does not persist a PostHog identifier in
        cookies or browser storage, disables autocapture and session recording,
        and does not intentionally send image contents, filenames, form values,
        or account identity with tool events. Authentication and security
        features may still use strictly necessary cookies.
      </p>

      <h2>7. Service providers and disclosures</h2>
      <p>
        We use service providers to host and operate Geiger. These currently
        include Vercel for hosting and delivery, Supabase for authentication and
        data services, PostHog for privacy-reduced analytics, Vercel Blob or
        connected storage providers for files, and communication or payment
        providers when those features are used. They process data under their
        own terms and our instructions where applicable.
      </p>
      <p>
        We may also disclose data when required by law, to protect users or the
        services, in connection with a business reorganization, or when you
        direct or consent to the disclosure. We do not sell personal data.
      </p>

      <h2>8. International processing</h2>
      <p>
        Geiger and its providers may process data in countries other than your
        own. Where required, we use contractual, organizational, or other lawful
        safeguards for international transfers.
      </p>

      <h2>9. Retention</h2>
      <p>
        We retain account and workspace data while your account is active and
        for a reasonable period afterward where needed for recovery, security,
        dispute resolution, or legal compliance. Retention varies by data type,
        product configuration, and legal requirement. Backups may persist for a
        limited period before being overwritten. We delete or de-identify data
        when it is no longer reasonably required.
      </p>

      <h2>10. Security</h2>
      <p>
        We use reasonable technical and organizational measures designed to
        protect data. No online service can guarantee absolute security. You are
        responsible for safeguarding your credentials and for configuring
        sharing and access controls appropriately.
      </p>

      <h2>11. Your choices and rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct,
        delete, restrict, object to, or receive a copy of personal data, withdraw
        consent, nominate another person, or complain to a regulator. You may
        also update certain account information directly in the product.
      </p>
      <p>
        Send requests to{" "}
        <a href="mailto:privacy@geiger.studio">privacy@geiger.studio</a>. We may
        need to verify your identity and may retain limited information about
        the request. We aim to acknowledge privacy and grievance requests within
        seven days and respond within the period required by applicable law.
      </p>

      <h2>12. Children</h2>
      <p>
        Geiger is not directed to children. You must be at least 18 years old to
        create an account unless an authorized organization has arranged lawful
        use with the required parent or guardian involvement. If you believe a
        child provided personal data unlawfully, contact us.
      </p>

      <h2>13. Changes to this policy</h2>
      <p>
        We may update this policy as the services or legal requirements change.
        We will publish the revised version with a new “Last updated” date and
        provide additional notice where required.
      </p>
    </LegalPage>
  );
}

