// The shell every Geiger email renders inside: branded header, white card body,
// and a muted footer. Templates only supply the card contents.

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Preview,
} from "@react-email/components";
import { theme, APP_URL, GEIST_FONT_HREF } from "../theme.js";

const styles = {
  body: {
    backgroundColor: theme.color.background,
    fontFamily: theme.font.sans,
    margin: 0,
    padding: "32px 0",
  },
  container: {
    width: theme.width,
    maxWidth: "100%",
    margin: "0 auto",
    padding: "0 16px",
  },
  header: {
    padding: "4px 8px 20px",
  },
  brand: {
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: theme.color.brand,
    margin: 0,
  },
  brandSub: {
    fontSize: "12px",
    color: theme.color.muted,
    margin: "2px 0 0",
  },
  card: {
    backgroundColor: theme.color.card,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius,
    padding: "32px",
  },
  footer: {
    padding: "20px 8px 0",
  },
  footerText: {
    fontSize: "12px",
    lineHeight: "18px",
    color: theme.color.subtle,
    margin: 0,
  },
  footerLink: {
    color: theme.color.muted,
    textDecoration: "underline",
  },
};

export function Layout({ preview, product = "Geiger Studio", children, footerNote }) {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href={GEIST_FONT_HREF} />
      </Head>
      {preview ? <Preview>{preview}</Preview> : null}
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brand}>{product}</Text>
            <Text style={styles.brandSub}>Part of the Geiger Studio suite</Text>
          </Section>

          <Section style={styles.card}>{children}</Section>

          <Section style={styles.footer}>
            {footerNote ? (
              <Text style={styles.footerText}>{footerNote}</Text>
            ) : null}
            <Hr
              style={{
                borderColor: theme.color.border,
                margin: "12px 0",
              }}
            />
            <Text style={styles.footerText}>
              Sent by Geiger Studio ·{" "}
              <Link href={APP_URL} style={styles.footerLink}>
                geiger.studio
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
