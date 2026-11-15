import {
  AreaHero,
  AreaPage,
  AreaSection,
  FactList,
  FaqList,
  FeatureCell,
  FeatureGrid,
  Fit,
  HeroArt,
  SpecTable,
  Stage,
  TextCards,
} from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  AccessCodeRender,
  BoxOfficeWindow,
  BundleRender,
  CheckoutStage,
  DiscountsStage,
  ExpressLaneRender,
  FreeAndRequestRender,
  GroupDonationRender,
  HallMapRender,
  OrdersRender,
  SeatsStage,
  WavesRender,
} from "@/components/product-pages/apps/events/ticketing_renders";
import {
  CHECKED,
  EVENT_TYPES,
  FACTS,
  FAQ,
  FEATURES,
  FEE_EXAMPLE,
  FEE_NOTE,
  PLANS,
  PLANS_NOTE,
  SUMMARY,
} from "@/components/product-pages/apps/events/ticketing_copy";

const SITE_URL = "https://geiger.studio";
const PAGE = findTourPage("events", "ticketing");
const LINK = { label: "Geiger Events", href: "/events" };

const featureName = (cell) => (typeof cell === "string" ? cell : cell.label);

// The same facts the page states, for search engines; the app's @id matches the /events landing so both describe one product.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/events#app`,
      name: "Geiger Events",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Event ticketing software",
      operatingSystem: "Web",
      url: `${SITE_URL}/events`,
      description: SUMMARY,
      featureList: FEATURES.flatMap((group) => group.rows.map(([feature]) => featureName(feature))),
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "0",
        highPrice: "119",
        offerCount: 4,
        url: `${SITE_URL}/pricing`,
        description: "A $0 plan during early access, then Basic $29, Plus $79 and Pro $119 a month. No platform fee on ticket sales; Stripe's processing fee applies.",
      },
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Geiger Studios", url: `${SITE_URL}/` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}${PAGE.href}#faq`,
      mainEntity: FAQ.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Geiger Events", item: `${SITE_URL}/events` },
        { "@type": "ListItem", position: 3, name: PAGE.label, item: `${SITE_URL}${PAGE.href}` },
      ],
    },
  ],
};

// /apps/events/ticketing: everything Geiger Events sells and how, in plain text a search engine can quote, around the product renders.
export function EventsTicketingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <AreaPage area={PAGE.id} links={findTour("events").pages} linksLabel="More from Geiger Events">
        <AreaHero
          page={PAGE}
          art={
            <HeroArt focus={["68%", "44%"]} plane={{ "--plane-top": "-6%", "--plane-left": "16%" }}>
              <BoxOfficeWindow />
            </HeroArt>
          }
        />

        <AreaSection title="What is Geiger Events ticketing?" lead={SUMMARY}>
          <FactList items={FACTS} note={`Checked against the product on ${CHECKED}.`} />
        </AreaSection>

        <AreaSection
          id="checkout"
          title="Sell tickets from your own event page"
          lead="Every event gets a public page with its own checkout. Guests choose their tickets, add a workshop or a time slot, apply a code and pay on Stripe Checkout, and a signed Stripe webhook turns each payment into an order."
          link={LINK}
        >
          <Stage
            title="From the event page to a paid order"
            body="Checkout steps through the buyer's details, their seats and add-ons, then a review with every discount and donation itemised. Buyers can be asked to accept your terms before they pay on Stripe Checkout, which takes your event's colours, and free orders skip payment."
          >
            <Fit width={1000} height={620}>
              <CheckoutStage />
            </Fit>
          </Stage>
          <FeatureGrid>
            <FeatureCell
              title="Two-click checkout with Express Lane"
              body="Turn on Express Lane and a buyer picks a ticket and pays on Stripe, which takes their email and card. A link back to the full checkout covers add-ons, codes and time slots."
            >
              <Fit width={460} height={300}>
                <ExpressLaneRender />
              </Fit>
            </FeatureCell>
            <FeatureCell
              title="Release tickets in waves"
              body="Split a ticket into waves that open when the last one sells out, on a date or when you say so. Between waves, buyers see when the next one opens."
            >
              <Fit width={460} height={300}>
                <WavesRender />
              </Fit>
            </FeatureCell>
            <FeatureCell
              title="Group discounts and donations"
              body="A group discount takes a percentage off once an order reaches the minimum group size you set, and buyers can add a donation to a cause you name."
            >
              <Fit width={460} height={300}>
                <GroupDonationRender />
              </Fit>
            </FeatureCell>
            <FeatureCell
              title="Free tickets and approval before payment"
              body="A free ticket completes without a payment step. When an event needs your approval, guests request a place and can only buy once you approve them."
            >
              <Fit width={460} height={300}>
                <FreeAndRequestRender />
              </Fit>
            </FeatureCell>
          </FeatureGrid>
        </AreaSection>

        <AreaSection
          id="pricing"
          title="Ticket prices that apply themselves"
          lead="Build early-bird rules, discount codes, group rules and affiliate codes once in Discounts & Codes, attach them to an event, and checkout works out every price. For prices that step up, sell each price as its own ticket with its own quantity."
          link={LINK}
        >
          <Stage
            title="A discount code with rules of its own"
            body="Give a code a base discount, a usage limit and the dates it works, then add rules that change what it gives by quantity or date. Rules are checked top-down and the first match wins."
          >
            <Fit width={1000} height={620}>
              <DiscountsStage />
            </Fit>
          </Stage>
          <FeatureGrid>
            <FeatureCell title="Ticket bundles at one price" body="Sell several tickets together at a fixed bundle price, or charge the sum of the tickets inside it.">
              <Fit width={460} height={300}>
                <BundleRender />
              </Fit>
            </FeatureCell>
            <FeatureCell
              title="Hidden tickets behind an access code"
              body="Access-code tickets stay off the public page until a buyer enters the code that unlocks them, like a student or speaker pass."
            >
              <Fit width={460} height={300}>
                <AccessCodeRender />
              </Fit>
            </FeatureCell>
          </FeatureGrid>
        </AreaSection>

        <AreaSection
          id="seats"
          title="Reserved seating, expo booths and every order"
          lead="Draw the room and the expo hall once, sell exact seats and stands, and keep every order on one list from payment to refund."
          link={LINK}
        >
          <Stage
            title="Reserved seating on your own seat map"
            body="Build each section from its rows, seats per row, curve and aisles, or generate a theatre horseshoe, oval stadium, rectangular arena or banquet tables, then import your real row and seat labels from a CSV. Buyers pick seats on the map or from a list sorted by best seats or lowest price, and their seats are held while they pay."
          >
            <Fit width={1000} height={620}>
              <SeatsStage />
            </Fit>
          </Stage>
          <FeatureGrid>
            <FeatureCell
              title="Sell exhibitor booths from a hall plan"
              body="Lay out booths on a hall plan and let exhibitors pick and pay for their stand at checkout. Each stand is held while they pay and can't be sold twice."
            >
              <Fit width={460} height={300}>
                <HallMapRender />
              </Fit>
            </FeatureCell>
            <FeatureCell
              title="Every order, one list"
              body="See each order's items, status, total and Stripe receipt, mark refunds and cancellations so seats go back on sale, and log a dispute with its evidence deadline."
            >
              <Fit width={460} height={300}>
                <OrdersRender />
              </Fit>
            </FeatureCell>
          </FeatureGrid>
        </AreaSection>

        <AreaSection
          title="Ticketing for the event you run"
          lead="The same box office fits very different events. These are the tools each kind of organiser reaches for first."
        >
          <TextCards items={EVENT_TYPES} />
        </AreaSection>

        <AreaSection
          id="features"
          title="Everything in Geiger Events ticketing"
          lead="Every feature in these tables works in the product today. What isn't built yet is listed in the last question at the foot of the page."
          link={LINK}
        >
          {FEATURES.map((group) => (
            <SpecTable key={group.title} title={group.title} rows={group.rows} />
          ))}
        </AreaSection>

        <AreaSection
          title="What does Geiger Events cost?"
          lead="Geiger adds no fee to your tickets. You pay for your Geiger plan, and Stripe charges its processing fee on each payment, straight from your own Stripe account."
          link={{ label: "See pricing", href: "/pricing" }}
        >
          <SpecTable title="On a $25 ticket" head={["", "Amount"]} rows={FEE_EXAMPLE} numeric note={FEE_NOTE} />
          <FactList items={PLANS} note={PLANS_NOTE} className="sm:grid-cols-3 lg:grid-cols-3" />
        </AreaSection>

        <AreaSection id="faq" title="Questions organisers ask" lead="Straight answers about fees, seating, pricing, refunds and what isn't built yet.">
          <FaqList items={FAQ} />
        </AreaSection>
      </AreaPage>
    </>
  );
}
