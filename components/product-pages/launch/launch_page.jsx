import { AreaHero, AreaPage, AreaSection, CalloutStage, FeatureCell, FeatureGrid, Fit, SplitShowcase, Stage } from "@/components/product-pages/area_kit";
import { HeroVideo } from "@/components/product-pages/hero_video";
import { DisplayBoardRender, DoorRender, EventsStage, ReleasesRender, SeatMapRender } from "@/components/product-pages/launch/events_renders";
import { ContentStage, LocalesRender, WebhooksRender } from "@/components/product-pages/launch/content_renders";
import { AssetDetail, ShareLinkRender, StorefrontRender } from "@/components/product-pages/launch/assets_renders";
import { ApiMonitoringStage, GatewayDiagram, PortalRender, TerminalWindow, UsagePlansRender } from "@/components/product-pages/launch/pods_renders";

const ASSET_STEPS = [
  { title: "Versions", body: "Every upload keeps its history, from first grade to final retouch" },
  { title: "Approval pipelines", body: "Review in stages, in order or any order, each with a deadline" },
  { title: "Share links", body: "Expiring links with passwords, views and download counts" },
  { title: "Licensing", body: "Rights, territories and renewals for everything you license out" },
];

const GATEWAY_LEFT = [
  { title: "Custom domains", body: "Verify DNS, then add mutual TLS and routing rules" },
  { title: "Web application firewall", body: "Managed rule sets for SQL injection, known bad inputs and admin paths" },
];

const GATEWAY_RIGHT = [
  { title: "Keys and usage plans", body: "A rate, a burst and a quota for every customer key" },
  { title: "Canary releases", body: "Send a slice of traffic to a new deployment before the rest" },
];

// /launch: what goes out the door — event pages and tickets, published content, approved media and APIs.
export function LaunchPage() {
  return (
    <AreaPage area="launch">
      <AreaHero
        eyebrow="Publish, sell and deliver"
        title="Ship it to the people it's for"
        art={<HeroVideo name="events-hero" />}
      />

      <AreaSection
        id="events"
        title="Sell the tickets, then run the door"
        lead="Publish an event page, sell tiered tickets through Stripe, and check every guest in at the gate with a rotating QR code."
        link={{ label: "Geiger Events", href: "/events" }}
      >
        <Stage title="A page and a checkout that sell for you" body="Every event gets a public page with its schedule, location and FAQ. Guests choose their tiers, apply a code and pay with Stripe, or check out in two clicks with Express Lane.">
          <Fit width={1000} height={620}>
            <EventsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Release tickets in batches" body="Put each release on sale now, on a date, once the one before it sells out, or by hand, and watch every batch fill.">
            <Fit width={460} height={300}>
              <ReleasesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Seat maps with price bands" body="Draw the venue once, band its seats by price, and let guests pick the exact seats they want.">
            <Fit width={460} height={300}>
              <SeatMapRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Check in at the door" body="Tickets carry rotating QR codes for the check-in app, and a kiosk handles self check-in, on-site registration or a last-minute ticket.">
            <Fit width={460} height={300}>
              <DoorRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Boards for the venue screens" body="Put the running order on any screen with display boards: a title card, Now & Next, the full day, or what's up next in each room.">
            <Fit width={460} height={300}>
              <DisplayBoardRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="content"
        title="Publish once, serve it anywhere"
        lead="Model your content, move entries from draft through review to a scheduled release, and serve them to any site or app from a public API."
        link={{ label: "Geiger Content", href: "/content" }}
      >
        <Stage title="From draft to live without a deploy" body="Entries move from Draft to In review to Scheduled to Published, and scheduled entries go live on time. Every published entry is served over a REST API with an edge cache you can tune and invalidate.">
          <Fit width={1000} height={620}>
            <ContentStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Tell your other systems the moment it changes" body="Webhooks fire when an entry is published, unpublished or scheduled, and every delivery is logged with its response.">
            <Fit width={460} height={250}>
              <WebhooksRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="One entry, every language" body="Add locales that fall back to your default language, so a page still renders while its translation is under way.">
            <Fit width={440} height={270}>
              <LocalesRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="assets"
        title="Approve it, license it, hand it over"
        lead="Keep every version of a file, route it through review, then deliver it with share links, licences and a storefront that keep track of what happens next."
        link={{ label: "Geiger Assets", href: "/assets" }}
      >
        <SplitShowcase
          items={ASSET_STEPS}
          active={1}
          title="Sign-off in stages, each with its own deadline"
          body="Approval pipelines run in sequence or in any order. Each stage has an owner and an SLA in hours, and the asset keeps every version alongside the decision."
        >
          <Fit width={680} height={400}>
            <AssetDetail />
          </Fit>
        </SplitShowcase>
        <FeatureGrid>
          <FeatureCell title="Links that expire on schedule" body="Share publicly or with restricted access, add a password, set an expiry, and see every view and download.">
            <Fit width={440} height={250}>
              <ShareLinkRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Sell the work, not just show it" body="Publish galleries in masonry, grid, justified or slideshow layouts, and sell prints and downloads with Stripe checkout, orders and invoices.">
            <Fit width={460} height={300}>
              <StorefrontRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="apis"
        title="A gateway in front of every API"
        lead="Route, protect, meter and document your APIs in one place, then ship changes from the terminal with a plan you can read first."
        link={{ label: "Geiger Pods", href: "/pods" }}
      >
        <Stage title="Watch each stage as it serves traffic" body="Each API keeps its routes, authorizers, CORS, deployments and stages together. Monitoring tracks requests, p50 to p99 latency, 4XX and 5XX errors, cache hits and throttled calls.">
          <Fit width={1000} height={620}>
            <ApiMonitoringStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Plans that meter every key" body="Usage plans set a rate, a burst and a daily or monthly quota. Keys belong to a customer, and you can rotate them or reset their quota at any time.">
            <Fit width={460} height={250}>
              <UsagePlansRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A developer portal with SDKs" body="Publish products and pages to a portal that can require sign-in, with SDKs generated for TypeScript, Python, Go, Swift and five more languages.">
            <Fit width={460} height={270}>
              <PortalRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
        <Stage title="Ship an API change from your terminal" body="The pods CLI plans and applies changes from a config file, deploys a stage, tails live logs and reads metrics, so an API change moves like any other code.">
          <Fit width={1180} height={600}>
            <TerminalWindow typed="pods deploy --api anime-explorer --stage prod" />
          </Fit>
        </Stage>
        <CalloutStage
          left={GATEWAY_LEFT}
          right={GATEWAY_RIGHT}
          title="Every request passes the same checks"
          body="A call reaches your domain, clears the firewall, is matched to a key and its usage plan, and only then hits the route, on every stage of every API."
        >
          <GatewayDiagram />
        </CalloutStage>
      </AreaSection>
    </AreaPage>
  );
}
