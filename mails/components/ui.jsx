// Small, reusable building blocks for email bodies. Templates compose these so
// spacing and colour stay consistent across the whole library.

import {
  Heading,
  Text,
  Button,
  Section,
  Row,
  Column,
  Hr,
} from "@react-email/components";
import { theme } from "../theme.js";

// Brand font stack — applied to every text element because email clients don't
// reliably inherit font-family (Outlook falls back to Times New Roman otherwise).
const font = theme.font.sans;

export function EmailHeading({ children }) {
  return (
    <Heading
      as="h1"
      style={{
        fontFamily: font,
        fontSize: "22px",
        lineHeight: "30px",
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: theme.color.heading,
        margin: "0 0 16px",
      }}
    >
      {children}
    </Heading>
  );
}

export function Paragraph({ children, muted = false }) {
  return (
    <Text
      style={{
        fontFamily: font,
        fontSize: "15px",
        lineHeight: "24px",
        color: muted ? theme.color.muted : theme.color.text,
        margin: "0 0 16px",
      }}
    >
      {children}
    </Text>
  );
}

export function EmailButton({ href, children, variant = "primary" }) {
  const isPrimary = variant === "primary";
  return (
    <Section style={{ margin: "8px 0 24px" }}>
      <Button
        href={href || "#"}
        style={{
          backgroundColor: isPrimary ? theme.color.accent : theme.color.card,
          color: isPrimary ? "#ffffff" : theme.color.heading,
          border: isPrimary ? "none" : `1px solid ${theme.color.border}`,
          fontFamily: font,
          fontSize: "14px",
          fontWeight: 600,
          padding: "11px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        {children}
      </Button>
    </Section>
  );
}

export function Divider() {
  return (
    <Hr style={{ borderColor: theme.color.border, margin: "8px 0 20px" }} />
  );
}

// A boxed metadata panel: a list of label/value rows (e.g. Project, Priority).
export function DataPanel({ rows = [] }) {
  const visible = rows.filter((r) => r && r.value);
  if (visible.length === 0) return null;
  return (
    <Section
      style={{
        backgroundColor: theme.color.panel,
        border: `1px solid ${theme.color.border}`,
        borderRadius: "10px",
        padding: "8px 16px",
        margin: "0 0 24px",
      }}
    >
      {visible.map((row, i) => (
        <Row key={row.label} style={{ padding: "8px 0" }}>
          <Column style={{ width: "38%", verticalAlign: "top" }}>
            <Text
              style={{
                fontFamily: font,
                fontSize: "13px",
                color: theme.color.muted,
                margin: 0,
              }}
            >
              {row.label}
            </Text>
          </Column>
          <Column style={{ verticalAlign: "top" }}>
            <Text
              style={{
                fontFamily: font,
                fontSize: "13px",
                fontWeight: 600,
                color: theme.color.heading,
                margin: 0,
              }}
            >
              {row.value}
            </Text>
          </Column>
          {i < visible.length - 1 ? null : null}
        </Row>
      ))}
    </Section>
  );
}

// A quote-style callout for surfacing user content (comments, messages).
export function Quote({ children }) {
  return (
    <Section
      style={{
        borderLeft: `3px solid ${theme.color.accent}`,
        backgroundColor: theme.color.accentSoft,
        borderRadius: "0 8px 8px 0",
        padding: "12px 16px",
        margin: "0 0 24px",
      }}
    >
      <Text
        style={{
          fontFamily: font,
          fontSize: "14px",
          lineHeight: "22px",
          color: theme.color.text,
          fontStyle: "italic",
          margin: 0,
        }}
      >
        {children}
      </Text>
    </Section>
  );
}

// A large monospaced code block for OTP / verification codes.
export function CodeBlock({ children }) {
  return (
    <Section
      style={{
        backgroundColor: theme.color.panel,
        border: `1px solid ${theme.color.border}`,
        borderRadius: "10px",
        padding: "16px",
        margin: "0 0 24px",
        textAlign: "center",
      }}
    >
      <Text
        style={{
          fontFamily: theme.font.mono,
          fontSize: "28px",
          fontWeight: 700,
          letterSpacing: "0.3em",
          color: theme.color.heading,
          margin: 0,
        }}
      >
        {children}
      </Text>
    </Section>
  );
}
