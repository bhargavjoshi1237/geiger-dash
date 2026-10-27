import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
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

const PAGE = findTourPage("events", "ticketing");
const LINK = { label: "Geiger Events", href: "/events" };

// /apps/events/ticketing: the event page and checkout, discounts that price each order, and seats, booths and orders.
export function EventsTicketingPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("events").pages} linksLabel="More from Geiger Events">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["68%", "44%"]} plane={{ "--plane-top": "-6%", "--plane-left": "16%" }}>
            <BoxOfficeWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="checkout"
        title="The page sells, the checkout closes"
        lead="Every event gets a public page with its own checkout. Guests choose their passes, add a workshop, apply a code and pay with Stripe, and a signed webhook turns each payment into an order."
        link={LINK}
      >
        <Stage
          title="From the event page to a paid order"
          body="Checkout steps through the buyer's details, their seats and add-ons, then a review with every discount and donation itemised. Payment happens on Stripe Checkout, and free orders skip it."
        >
          <Fit width={1000} height={620}>
            <CheckoutStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Two clicks with Express Lane" body="Turn on Express Lane and a buyer picks a ticket and pays on Stripe, which takes their email and card. A link back to the full checkout covers add-ons, codes and time slots.">
            <Fit width={460} height={300}>
              <ExpressLaneRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Release tickets in waves" body="Split a ticket into waves that open when the last one sells out, on a date or when you say so. Between waves, buyers see when the next one opens.">
            <Fit width={460} height={300}>
              <WavesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Group discounts and donations" body="A group discount takes a percentage off once an order reaches the minimum group size you set, and buyers can add a donation to a cause you name.">
            <Fit width={460} height={300}>
              <GroupDonationRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Free tickets and requests skip the card" body="A free ticket completes without a payment step. When an event needs your approval, guests request a place instead of paying.">
            <Fit width={460} height={300}>
              <FreeAndRequestRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="pricing"
        title="Prices that apply themselves"
        lead="Build coupons, group rules, early-bird rules and affiliate codes once in Discounts & Codes, attach them to an event, and checkout works out every price."
        link={LINK}
      >
        <Stage
          title="A coupon with rules of its own"
          body="Give a code a base discount, a usage limit and the dates it works, then add rules that change what it gives by quantity or date. Rules are checked top-down and the first match wins."
        >
          <Fit width={1000} height={620}>
            <DiscountsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Bundles at one price" body="Sell several tickets together at a fixed bundle price, or charge the sum of the tickets inside it.">
            <Fit width={460} height={300}>
              <BundleRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Hidden tickets behind a code" body="Access-code tickets stay off the public page until a buyer enters the code that unlocks them, like a student pass for the local art schools.">
            <Fit width={460} height={300}>
              <AccessCodeRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="seats"
        title="Seats, booths and every order"
        lead="Draw the room and the expo hall once, sell exact seats and stands, and keep every order on one list from payment to dispute."
        link={LINK}
      >
        <Stage
          title="Pick a seat, hold it, then buy it"
          body="Guests choose their seats on the map and the seats are held for them while they finish checkout. The seat-map editor builds each section from its rows, seats per row, curve and aisles."
        >
          <Fit width={1000} height={620}>
            <SeatsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Sell the expo floor" body="Lay out booths on a hall map in standard, corner and island sizes, and let exhibitors pick their stand at checkout.">
            <Fit width={460} height={300}>
              <HallMapRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every order, one list" body="See each order's items, status and total, record refunds and cancellations, and track a dispute's status and evidence deadline.">
            <Fit width={460} height={300}>
              <OrdersRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
