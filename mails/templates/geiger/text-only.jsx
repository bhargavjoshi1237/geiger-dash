// Text-only notice — a Geiger-branded port of React Email's "Barebones /
// text-only" demo (https://demo.react.email/preview/01-Barebone/text-only).
//
// No hero image, no big button: a plain, image-light layout for concise product
// notes, receipts, and account updates. Every line of copy is an editable
// content slot; runtime values (name, link) come from `data`.

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Link,
  Img,
  Hr,
  Preview,
} from "@react-email/components";
import { theme, APP_URL } from "../../theme.js";

const c = theme.color;

const styles = {
  body: {
    backgroundColor: c.background,
    fontFamily: theme.font.sans,
    margin: 0,
    padding: "32px 0",
    textAlign: "center",
  },
  container: { width: "600px", maxWidth: "100%", margin: "0 auto", padding: "0 16px" },
  card: {
    backgroundColor: c.card,
    border: `1px solid ${c.border}`,
    borderRadius: theme.radius,
    overflow: "hidden",
  },
  header: { padding: "20px 24px" },
  wordmark: {
    fontSize: "17px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: c.heading,
    margin: 0,
    verticalAlign: "middle",
  },
  eyebrow: { fontSize: "13px", color: c.subtle, margin: 0, textAlign: "right" },
  panel: {
    backgroundColor: c.panel,
    borderRadius: theme.radius,
    margin: "0 16px",
    padding: "40px",
    textAlign: "left",
  },
  heading: {
    fontSize: "26px",
    lineHeight: "1.2",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: c.heading,
    margin: "0 0 24px",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "26px",
    color: c.text,
    margin: "0 0 20px",
    maxWidth: "440px",
  },
  link: { color: c.heading, fontWeight: 600, textDecoration: "underline" },
  signoff: {
    fontSize: "14px",
    lineHeight: "22px",
    color: c.muted,
    margin: "28px 0 0",
    whiteSpace: "pre-line",
  },
  footer: { padding: "32px 24px 28px", textAlign: "center" },
  slogan: {
    fontSize: "13px",
    lineHeight: "20px",
    color: c.muted,
    margin: "0 auto 16px",
    maxWidth: "320px",
  },
  social: { fontSize: "13px", color: c.subtle, margin: "0 0 16px", textAlign: "center" },
  socialLink: { color: c.muted, textDecoration: "none" },
  address: { fontSize: "11px", lineHeight: "18px", color: c.subtle, margin: 0 },
  addressLink: { color: c.subtle, textDecoration: "underline" },
};

export default function TextOnly({ content = {}, data = {} }) {
  const ctaUrl = data.ctaUrl || APP_URL;
  const paragraphs = [content.intro, content.body].filter(Boolean);

  return (
    <Html>
      <Head />
      {content.intro ? <Preview>{content.intro}</Preview> : null}
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            {/* Header: logo + wordmark left, eyebrow right */}
            <Section style={styles.header}>
              <Row>
                <Column style={{ verticalAlign: "middle" }}>
                  <Img
                    src={`${APP_URL}/logo.png`}
                    width={28}
                    height={28}
                    alt="Geiger"
                    style={{ display: "inline-block", verticalAlign: "middle", borderRadius: "6px" }}
                  />
                  <span style={{ width: "8px", display: "inline-block" }} />
                  <span style={styles.wordmark}>Geiger</span>
                </Column>
                <Column style={{ verticalAlign: "middle" }}>
                  <Text style={styles.eyebrow}>{content.eyebrow}</Text>
                </Column>
              </Row>
            </Section>

            {/* Body panel */}
            <Section style={styles.panel}>
              <Text style={styles.heading}>{content.heading}</Text>

              {paragraphs.map((block, i) => (
                <Text key={i} style={styles.paragraph}>
                  {block}
                </Text>
              ))}

              <Text style={styles.paragraph}>
                <Link href={ctaUrl} style={styles.link}>
                  {content.cta_label}
                </Link>
              </Text>

              <Text style={styles.signoff}>{content.signoff}</Text>
            </Section>

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.slogan}>{content.slogan}</Text>
              <Text style={styles.social}>
                <Link href="https://geiger.studio" style={styles.socialLink}>
                  Web
                </Link>
                {"  ·  "}
                <Link href="https://github.com/bhargavjoshi1237" style={styles.socialLink}>
                  GitHub
                </Link>
                {"  ·  "}
                <Link href={APP_URL} style={styles.socialLink}>
                  Dashboard
                </Link>
              </Text>
              <Hr style={{ borderColor: c.border, margin: "0 auto 16px", maxWidth: "320px" }} />
              <Text style={styles.address}>{content.address}</Text>
              <Text style={styles.address}>
                Sent by Geiger ·{" "}
                <Link href={APP_URL} style={styles.addressLink}>
                  geiger.studio
                </Link>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
