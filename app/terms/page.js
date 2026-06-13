import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Terms of Service",
  description:
    "The terms governing access to and use of Geiger Studios products and services.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | Geiger Studios",
    description:
      "The terms governing access to and use of Geiger Studios products and services.",
    url: "/terms",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Geiger Studios",
    description: "Terms governing use of Geiger Studios services.",
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      summary="These terms govern your access to Geiger Studios websites, applications, tools, and hosted services."
      updated="June 13, 2026"
    >
      <h2>1. Acceptance</h2>
      <p>
        By accessing or using Geiger, you agree to these Terms of Service and
        our Privacy Policy. If you use Geiger for an organization, you represent
        that you have authority to bind that organization. If you do not agree,
        do not use the services.
      </p>

      <h2>2. Eligibility and accounts</h2>
      <p>
        You must be at least 18 years old and legally capable of entering a
        contract. You must provide accurate account information, protect your
        credentials, and promptly notify us of suspected unauthorized access.
        You are responsible for activity under your account and for people you
        invite to your workspace.
      </p>

      <h2>3. The services</h2>
      <p>
        Geiger provides collaboration, content, project, asset, document,
        communication, and browser-based file tools. Features may be preview,
        beta, experimental, or provided without charge. We may improve, replace,
        suspend, or discontinue features, while taking reasonable steps to avoid
        unnecessary disruption.
      </p>

      <h2>4. Your content</h2>
      <p>
        You retain ownership of content you submit to Geiger. You grant us a
        limited, worldwide, non-exclusive license to host, copy, transmit,
        display, modify, and process that content only as reasonably necessary
        to provide, secure, support, and improve the services or as you direct.
        This license ends when the content is deleted, subject to backups and
        legal retention requirements.
      </p>
      <p>
        You represent that you have the rights and permissions necessary to use
        and share your content. You are responsible for your content, workspace
        permissions, exports, backups, and compliance obligations.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You must not use Geiger to:</p>
      <ul>
        <li>Break the law or violate another person’s rights.</li>
        <li>Upload malware or interfere with service security or availability.</li>
        <li>Attempt unauthorized access, probing, scraping, or circumvention.</li>
        <li>Send spam, deceptive content, or abusive communications.</li>
        <li>Process content that you are not legally permitted to process.</li>
        <li>Resell or misuse the services beyond permitted product functionality.</li>
        <li>Use automated activity that creates unreasonable load or risk.</li>
      </ul>

      <h2>6. Public file tools</h2>
      <p>
        Browser-based image tools are provided for lawful files you control.
        Processing ordinarily occurs on your device. You are responsible for
        reviewing output quality, metadata, compatibility, and suitability
        before relying on or distributing a generated file.
      </p>

      <h2>7. Fees</h2>
      <p>
        Some services may require payment. Prices, usage limits, billing periods,
        taxes, renewal terms, and cancellation rules will be shown when you
        purchase a plan. Except where law requires otherwise, fees already
        incurred are non-refundable. We may change future pricing with
        reasonable notice.
      </p>

      <h2>8. Third-party services</h2>
      <p>
        Geiger may integrate with third-party storage, authentication, payment,
        AI, communication, or productivity services. Your use of those services
        is governed by their terms. We are not responsible for third-party
        systems that we do not control.
      </p>

      <h2>9. Geiger intellectual property</h2>
      <p>
        Geiger and its licensors retain all rights in the services, software,
        branding, documentation, and designs, excluding your content. These
        terms do not grant rights to use our trademarks or copy, modify,
        distribute, sell, lease, reverse engineer, or create competing
        derivatives of the services except where applicable law permits.
      </p>

      <h2>10. Feedback</h2>
      <p>
        If you provide feedback, you grant us permission to use it without
        restriction or compensation, while we remain free not to implement it.
      </p>

      <h2>11. Suspension and termination</h2>
      <p>
        You may stop using Geiger at any time. We may suspend or terminate access
        when reasonably necessary for security, legal compliance, non-payment,
        material breach, harmful activity, or protection of users and the
        services. Where practical, we will provide notice and an opportunity to
        remedy the issue.
      </p>

      <h2>12. Disclaimers</h2>
      <p>
        To the maximum extent permitted by law, the services are provided “as
        is” and “as available.” We disclaim implied warranties of
        merchantability, fitness for a particular purpose, non-infringement, and
        uninterrupted or error-free operation. Geiger is not legal, financial,
        medical, or other professional advice.
      </p>

      <h2>13. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Geiger will not be liable for
        indirect, incidental, special, consequential, exemplary, or punitive
        damages, or for loss of profits, revenue, goodwill, data, or business
        opportunity. Our aggregate liability arising from the services will not
        exceed the amount you paid to Geiger for the affected service during the
        twelve months before the event giving rise to the claim, or INR 5,000 if
        you used only free services. These limits do not apply where liability
        cannot legally be limited.
      </p>

      <h2>14. Indemnity</h2>
      <p>
        To the extent permitted by law, you will defend and indemnify Geiger
        against third-party claims arising from your content, your unlawful use
        of the services, or your material breach of these terms.
      </p>

      <h2>15. Governing law and disputes</h2>
      <p>
        These terms are governed by the laws of India, without regard to
        conflict-of-law principles. Courts of competent jurisdiction in India
        will have jurisdiction, unless applicable consumer law requires another
        forum. Before filing a claim, each party agrees to attempt in good faith
        to resolve the dispute by written notice for at least 30 days.
      </p>

      <h2>16. General terms</h2>
      <p>
        These terms and incorporated policies are the agreement between you and
        Geiger regarding the services. If a provision is unenforceable, the
        remaining provisions remain effective. Failure to enforce a provision
        is not a waiver. You may not assign these terms without our consent; we
        may assign them in connection with a reorganization or transfer of the
        services.
      </p>

      <h2>17. Changes and contact</h2>
      <p>
        We may update these terms. Material changes will apply prospectively and
        will be communicated where required. Continued use after the effective
        date means you accept the revised terms. Questions may be sent to{" "}
        <a href="mailto:legal@geiger.studio">legal@geiger.studio</a>.
      </p>
    </LegalPage>
  );
}

