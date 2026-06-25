// The shell every Geiger email renders inside: branded header, white card body,
// and a muted footer. Templates only supply the card contents.

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
    padding: "4px 16px 18px",
  },
  brand: {
    fontFamily: theme.font.sans,
    fontSize: "17px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: theme.color.brand,
    margin: 0,
    verticalAlign: "middle",
  },
  eyebrow: {
    fontFamily: theme.font.sans,
    fontSize: "13px",
    color: theme.color.subtle,
    margin: 0,
    textAlign: "right",
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
    fontFamily: theme.font.sans,
    fontSize: "12px",
    lineHeight: "18px",
    color: theme.color.subtle,
    margin: 0,
  },
  footerLink: {
    fontFamily: theme.font.sans,
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
            <Row>
              <Column style={{ verticalAlign: "middle", textAlign: "left", marginLeft: "16px" }}>
                <Img
                  src={`${APP_URL}/logo1-black.png`}
                  width={25}
                  height={15}
                  alt="Geiger Studio"
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                />
                <span style={{ width: "10px", display: "inline-block" }} />
                <span style={styles.brand}>Geiger Studio</span>
              </Column>
              {product && product !== "Geiger Studio" ? (
                <Column style={{ verticalAlign: "middle", textAlign: "right" }}>
                  <Text style={styles.eyebrow}>{product}</Text>
                </Column>
              ) : null}
            </Row>
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
