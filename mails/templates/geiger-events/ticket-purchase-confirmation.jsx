// A buyer's ticket order for a Geiger Events event completed payment.
//
// This is a full-bleed receipt rather than a card in the shared Layout: a dark
// hero with the order CTA, a seam strip carrying the order id, the event/pass/
// summary detail on white, and a dark link footer. Structure lives here; every
// line of copy is an editable `content` slot and all order values come from
// `data`. Rows whose value is missing are dropped rather than rendered blank.

import { Html, Head, Body, Preview, Link, Img } from "@react-email/components";
import { theme, APP_URL, GEIST_FONT_HREF } from "../../theme.js";

const c = theme.color;
const d = theme.dark;
const font = theme.font.sans;

// Outlook ignores CSS line-height unless mso-line-height-rule is set, so every
// block of text goes through this.
const t = (style) => ({ fontFamily: font, msoLineHeightRule: "exactly", ...style });

// Stacks the fixed 600px shell and the two-column rows down to a single column
// on narrow clients. Class names are attached to the elements below.
const RESPONSIVE_CSS = `
  body, table, td, p, a, span, div { font-family: ${font} !important; }
  @media only screen and (max-width:620px) {
    .shell { width:100% !important; }
    .gutter { padding-left:24px !important; padding-right:24px !important; }
    .h1 { font-size:27px !important; line-height:34px !important; }
    .btn-a { display:block !important; text-align:center !important; }
    .col { display:block !important; width:100% !important; }
    .col-pad { padding:0 0 12px 0 !important; }
    .foot-col { display:block !important; width:100% !important; padding-bottom:20px !important; }
    .hide-sm { display:none !important; }
    .stack-label { display:block !important; width:100% !important; padding:0 0 2px 0 !important; }
  }
`;

// Amounts arrive as bare numbers or already-formatted strings.
function money(value) {
  if (value == null || value === "") return null;
  const s = String(value).trim();
  return /^[\d.]/.test(s) ? `$${s}` : s;
}

const styles = {
  sectionLabel: t({
    margin: "0 0 20px",
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: c.subtle,
  }),
  rowTable: { width: "100%", borderTop: `1px solid ${c.border}` },
  rowLabel: t({
    width: "140px",
    padding: "16px 16px 16px 0",
    fontSize: "12px",
    lineHeight: "20px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: c.subtle,
  }),
  rowValue: t({ padding: "16px 0", fontSize: "14px", lineHeight: "22px" }),
  inlineLink: { color: c.heading, textDecoration: "underline" },
  footLink: { color: d.text, textDecoration: "none" },
};

// One label/value line in the event-detail and "before you go" stacks.
function DetailRow({ label, muted = false, children }) {
  if (!children) return null;
  return (
    <table role="presentation" cellPadding="0" cellSpacing="0" border="0" width="100%" style={styles.rowTable}>
      <tbody>
        <tr>
          <td className="stack-label" valign="top" width="140" style={styles.rowLabel}>
            {label}
          </td>
          <td valign="top" style={{ ...styles.rowValue, color: muted ? c.muted : c.heading }}>
            {children}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// One priced line of the order summary; `total` renders the emphasised last row.
function SummaryRow({ label, sub, amount, muted = false, total = false }) {
  if (!amount) return null;
  return (
    <table
      role="presentation"
      cellPadding="0"
      cellSpacing="0"
      border="0"
      width="100%"
      style={{ width: "100%", borderTop: `1px solid ${total ? c.heading : c.border}` }}
    >
      <tbody>
        <tr>
          <td
            valign="top"
            style={t({
              padding: total ? "16px 0 0" : "14px 0",
              fontSize: total ? "15px" : "14px",
              lineHeight: "22px",
              fontWeight: total ? 700 : 400,
              color: muted ? c.muted : c.heading,
            })}
          >
            {label}
            {sub ? (
              <>
                <br />
                <span style={{ fontSize: "13px", fontWeight: 400, color: c.muted }}>{sub}</span>
              </>
            ) : null}
          </td>
          <td
            valign="top"
            align="right"
            style={t({
              padding: total ? "16px 0 0" : "14px 0",
              fontSize: total ? "20px" : "14px",
              lineHeight: total ? "26px" : "22px",
              fontWeight: total || !muted ? 600 : 400,
              letterSpacing: total ? "-0.02em" : "normal",
              color: muted ? c.muted : c.heading,
              whiteSpace: "nowrap",
            })}
          >
            {amount}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// A dark-footer link column; renders nothing when none of its links resolved.
function FooterColumn({ title, links }) {
  const visible = links.filter((l) => l.href);
  if (visible.length === 0) return null;
  return (
    <td
      className="foot-col"
      align="left"
      valign="top"
      width="33%"
      style={t({ width: "33%", fontSize: "13px", lineHeight: "23px", color: d.text })}
    >
      <span
        style={{
          display: "block",
          paddingBottom: "8px",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: d.onSurface,
        }}
      >
        {title}
      </span>
      {visible.map((l) => (
        <span key={l.label}>
          <Link href={l.href} style={styles.footLink}>
            {l.label}
          </Link>
          <br />
        </span>
      ))}
    </td>
  );
}

// A full-width hairline used as a spacer between white sections.
function SectionGap() {
  return (
    <table role="presentation" cellPadding="0" cellSpacing="0" border="0" width="100%" style={styles.rowTable}>
      <tbody>
        <tr>
          <td height="28" style={{ height: "28px", fontSize: 0, lineHeight: 0 }}>
            &nbsp;
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default function TicketPurchaseConfirmation({ content = {}, data = {} }) {
  const ticketsUrl = data.ticketsUrl || data.eventUrl;
  const headingLines = String(content.heading || "").split("\n").filter(Boolean);
  const unitPrice = money(data.unitPrice);
  const ticketNote = [
    data.seatNote,
    data.quantity && unitPrice ? `${data.quantity} × ${unitPrice}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <link rel="stylesheet" href={GEIST_FONT_HREF} />
        <style dangerouslySetInnerHTML={{ __html: RESPONSIVE_CSS }} />
      </Head>
      {content.intro ? <Preview>{content.intro}</Preview> : null}
      <Body style={{ margin: 0, padding: 0, backgroundColor: c.canvasStrong, fontFamily: font }}>
        <table role="presentation" cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ backgroundColor: c.canvasStrong }}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: "36px 16px 44px" }}>
                <table
                  role="presentation"
                  cellPadding="0"
                  cellSpacing="0"
                  border="0"
                  width="600"
                  className="shell"
                  style={{ width: "600px", maxWidth: "600px" }}
                >
                  <tbody>
                    {/* Hero — brand bar */}
                    <tr>
                      <td bgcolor={d.surface} className="gutter" style={{ backgroundColor: d.surface, padding: "30px 40px 8px" }}>
                        <table role="presentation" cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                          <tbody>
                            <tr>
                              <td align="left" valign="middle" width="34" style={{ width: "34px", lineHeight: 0 }}>
                                <Img
                                  src={`${APP_URL}/email/logo-mark-light.png`}
                                  width={34}
                                  height={21}
                                  alt="Geiger"
                                  style={{ display: "block", border: 0 }}
                                />
                              </td>
                              <td
                                align="right"
                                valign="middle"
                                className="hide-sm"
                                style={t({
                                  fontSize: "11px",
                                  lineHeight: "20px",
                                  fontWeight: 700,
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  color: d.muted,
                                })}
                              >
                                Geiger Events
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Hero — headline + actions */}
                    <tr>
                      <td bgcolor={d.surface} className="gutter" style={{ backgroundColor: d.surface, padding: "40px 40px 44px" }}>
                        <p
                          style={t({
                            margin: "0 0 14px",
                            fontSize: "11px",
                            lineHeight: "16px",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: d.muted,
                          })}
                        >
                          {content.eyebrow}
                        </p>
                        <p
                          className="h1"
                          style={t({
                            margin: "0 0 16px",
                            fontSize: "34px",
                            lineHeight: "42px",
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                            color: d.heading,
                          })}
                        >
                          {headingLines.map((line, i) => (
                            <span key={line}>
                              {i > 0 ? <br /> : null}
                              {line}
                            </span>
                          ))}
                        </p>
                        <p style={t({ margin: "0 0 28px", fontSize: "15px", lineHeight: "25px", color: d.text, maxWidth: "430px" })}>
                          {content.intro}
                        </p>

                        <table role="presentation" cellPadding="0" cellSpacing="0" border="0">
                          <tbody>
                            <tr>
                              <td bgcolor={d.heading} style={{ backgroundColor: d.heading }}>
                                <Link
                                  className="btn-a"
                                  href={ticketsUrl || "#"}
                                  style={t({
                                    display: "block",
                                    padding: "14px 26px",
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    fontWeight: 600,
                                    letterSpacing: "-0.01em",
                                    color: d.surface,
                                    textDecoration: "none",
                                    textTransform: "uppercase",
                                  })}
                                >
                                  {content.cta_label}
                                </Link>
                              </td>
                              {data.calendarUrl ? (
                                <>
                                  <td width="12" style={{ width: "12px", fontSize: 0, lineHeight: 0 }}>
                                    &nbsp;
                                  </td>
                                  <td className="hide-sm" style={{ border: `1px solid ${d.borderStrong}` }}>
                                    <Link
                                      href={data.calendarUrl}
                                      style={t({
                                        display: "block",
                                        padding: "13px 22px",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                        fontWeight: 500,
                                        color: d.onSurface,
                                        textDecoration: "none",
                                      })}
                                    >
                                      {content.calendar_cta_label}
                                    </Link>
                                  </td>
                                </>
                              ) : null}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Seam strip — order id */}
                    <tr>
                      <td
                        bgcolor={d.surfaceStrong}
                        className="gutter"
                        style={{ backgroundColor: d.surfaceStrong, padding: "16px 40px", borderTop: `1px solid ${d.border}` }}
                      >
                        <table role="presentation" cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                          <tbody>
                            <tr>
                              <td
                                align="left"
                                valign="middle"
                                style={t({
                                  fontSize: "12px",
                                  lineHeight: "20px",
                                  fontWeight: 700,
                                  letterSpacing: "0.08em",
                                  textTransform: "uppercase",
                                  color: d.heading,
                                })}
                              >
                                Order {data.orderId}
                              </td>
                              {data.paidOn ? (
                                <td
                                  align="right"
                                  valign="middle"
                                  className="hide-sm"
                                  style={t({
                                    fontSize: "12px",
                                    lineHeight: "20px",
                                    fontWeight: 600,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: d.muted,
                                  })}
                                >
                                  Paid {data.paidOn}
                                </td>
                              ) : null}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Event details */}
                    <tr>
                      <td bgcolor={c.card} className="gutter" style={{ backgroundColor: c.card, padding: "40px 40px 8px" }}>
                        <p style={styles.sectionLabel}>{content.details_label}</p>
                        <p
                          style={t({
                            margin: "0 0 22px",
                            fontSize: "22px",
                            lineHeight: "30px",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            color: c.heading,
                          })}
                        >
                          {data.eventName}
                        </p>

                        <DetailRow label="Date">{data.eventDate}</DetailRow>
                        <DetailRow label="Time">{data.eventTime}</DetailRow>
                        <DetailRow label="Venue">
                          {data.venueName ? (
                            <>
                              {data.venueName}
                              {data.venueAddress ? (
                                <>
                                  <br />
                                  <span style={{ color: c.muted }}>{data.venueAddress}</span>
                                </>
                              ) : null}
                              {data.directionsUrl ? (
                                <>
                                  <br />
                                  <Link href={data.directionsUrl} style={styles.inlineLink}>
                                    Get directions
                                  </Link>
                                </>
                              ) : null}
                            </>
                          ) : null}
                        </DetailRow>
                        <DetailRow label="Ticket holder">
                          {data.buyerName ? (
                            <>
                              {data.buyerName}
                              {data.buyerEmail ? <span style={{ color: c.muted }}> · {data.buyerEmail}</span> : null}
                            </>
                          ) : null}
                        </DetailRow>
                      </td>
                    </tr>

                    {/* Entry pass — only when the order carries a scannable code */}
                    {data.qrUrl ? (
                      <tr>
                        <td bgcolor={c.card} className="gutter" style={{ backgroundColor: c.card, padding: "24px 40px 8px" }}>
                          <SectionGap />
                          <table role="presentation" cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                            <tbody>
                              <tr>
                                <td bgcolor={c.panel} style={{ backgroundColor: c.panel, border: `1px solid ${c.border}`, padding: "20px" }}>
                                  <table role="presentation" cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                    <tbody>
                                      <tr>
                                        <td className="col col-pad" valign="middle" width="112" style={{ width: "112px", paddingRight: "20px" }}>
                                          <Img
                                            src={data.qrUrl}
                                            width={96}
                                            height={96}
                                            alt={`Entry QR code for order ${data.orderId || ""}`.trim()}
                                            style={{ display: "block", border: `1px solid ${c.border}`, backgroundColor: c.card }}
                                          />
                                        </td>
                                        <td className="col" valign="middle" style={t({ fontSize: "13px", lineHeight: "21px", color: c.muted })}>
                                          <p style={t({ margin: "0 0 4px", fontSize: "14px", lineHeight: "22px", fontWeight: 700, color: c.heading })}>
                                            {content.pass_heading}
                                          </p>
                                          {content.pass_note}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    ) : null}

                    {/* Order summary */}
                    <tr>
                      <td bgcolor={c.card} className="gutter" style={{ backgroundColor: c.card, padding: "32px 40px 8px" }}>
                        <table role="presentation" cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                          <tbody>
                            <tr>
                              <td align="left" valign="middle" style={{ ...styles.sectionLabel, margin: 0, paddingBottom: "18px" }}>
                                {content.summary_label}
                              </td>
                              {data.receiptUrl ? (
                                <td align="right" valign="middle" style={t({ fontSize: "12px", lineHeight: "16px", paddingBottom: "18px" })}>
                                  <Link href={data.receiptUrl} style={{ color: c.muted, textDecoration: "underline" }}>
                                    Receipt (PDF)
                                  </Link>
                                </td>
                              ) : null}
                            </tr>
                          </tbody>
                        </table>

                        <SummaryRow label={data.ticketType} sub={ticketNote} amount={money(data.subtotal)} />
                        <SummaryRow label="Service fee" amount={money(data.serviceFee)} muted />
                        <SummaryRow label="Sales tax" amount={money(data.tax)} muted />
                        <SummaryRow label="Total paid" sub={data.paymentNote} amount={money(data.orderTotal)} total />
                      </td>
                    </tr>

                    {/* Before you go */}
                    <tr>
                      <td bgcolor={c.card} className="gutter" style={{ backgroundColor: c.card, padding: "32px 40px 40px" }}>
                        <SectionGap />
                        <p style={{ ...styles.sectionLabel, margin: "0 0 18px" }}>{content.notes_label}</p>

                        <DetailRow label="Check-in" muted>
                          {content.checkin_note}
                        </DetailRow>
                        <DetailRow label="Guest ticket" muted>
                          {content.guest_note ? (
                            <>
                              {content.guest_note}
                              {data.transferUrl ? (
                                <>
                                  {" "}
                                  <Link href={data.transferUrl} style={styles.inlineLink}>
                                    Assign now
                                  </Link>
                                </>
                              ) : null}
                            </>
                          ) : null}
                        </DetailRow>
                        <DetailRow label="Changes" muted>
                          {content.changes_note}
                        </DetailRow>
                        <DetailRow label="Getting there" muted>
                          {content.travel_note}
                        </DetailRow>

                        {content.outro ? (
                          <p style={t({ margin: "26px 0 0", fontSize: "13px", lineHeight: "21px", color: c.muted })}>{content.outro}</p>
                        ) : null}
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td bgcolor={d.surface} className="gutter" style={{ backgroundColor: d.surface, padding: "32px 40px 30px" }}>
                        <table role="presentation" cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                          <tbody>
                            <tr>
                              <FooterColumn
                                title="Your order"
                                links={[
                                  { label: "View tickets", href: ticketsUrl },
                                  { label: "Transfer a ticket", href: data.transferUrl },
                                  { label: "Receipt", href: data.receiptUrl },
                                ]}
                              />
                              <FooterColumn
                                title="Event"
                                links={[
                                  { label: "Event page", href: data.eventUrl },
                                  { label: "Venue & travel", href: data.directionsUrl },
                                ]}
                              />
                              <FooterColumn
                                title="Help"
                                links={[
                                  { label: "Ticket FAQ", href: `${APP_URL}/help/tickets` },
                                  { label: "Refund policy", href: `${APP_URL}/help/refunds` },
                                  { label: "Contact support", href: `${APP_URL}/support` },
                                ]}
                              />
                            </tr>
                          </tbody>
                        </table>

                        <table role="presentation" cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                          <tbody>
                            <tr>
                              <td height="26" style={{ height: "26px", fontSize: 0, lineHeight: 0 }}>
                                &nbsp;
                              </td>
                            </tr>
                            <tr>
                              <td height="1" style={{ height: "1px", backgroundColor: d.border, fontSize: 0, lineHeight: 0 }}>
                                &nbsp;
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style={t({ paddingTop: "18px", fontSize: "12px", lineHeight: "19px", color: d.footerText })}>
                                {content.legal_note}
                                <br />
                                <br />
                                {content.address}
                                <br />
                                <br />
                                <Link href={`${APP_URL}/privacy`} style={{ color: d.text, textDecoration: "underline" }}>
                                  Privacy Policy
                                </Link>
                                {" · "}
                                <Link href={`${APP_URL}/terms`} style={{ color: d.text, textDecoration: "underline" }}>
                                  Terms of Service
                                </Link>
                                {" · "}
                                <Link href={`${APP_URL}/preferences`} style={{ color: d.text, textDecoration: "underline" }}>
                                  Email preferences
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </Body>
    </Html>
  );
}
