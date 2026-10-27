import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  AccessRender,
  ApiRender,
  CheckoutStage,
  CouponsRender,
  EmbedStage,
  PaymentsRender,
  PrivacyRender,
  SecurityStage,
  SharePreviewRender,
  ShareWindow,
  SpamRender,
  WebhooksRender,
} from "@/components/product-pages/apps/forms/share_renders";

const PAGE = findTourPage("forms", "share-and-sell");

// /apps/forms/share-and-sell: publishing and embedding a form, taking payments with it, and keeping it safe and connected.
export function FormsShareAndSellPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("forms").pages} linksLabel="More from Geiger Forms">
      <AreaHero
        eyebrow={PAGE.eyebrow}
        title={PAGE.headline}
        art={
          <HeroArt focus={["66%", "44%"]} plane={{ "--plane-top": "-6%", "--plane-left": "14%" }}>
            <ShareWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="publish"
        title="Publish a link, embed it, send it"
        lead="Every published form gets its own link and QR code. Embed it on your site with one script tag, create signed links that expire, or email it to people with a personal link each."
        link={{ label: "Geiger Forms", href: "/forms" }}
      >
        <Stage
          title="Put the form wherever your people are"
          body="Embed a form inline, as a popup, slider, side tab, popover or full screen, or as a plain iframe. Display rules decide when it opens, after a delay, at a scroll depth or on exit intent, and how often it shows."
        >
          <Fit width={1000} height={620}>
            <EmbedStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Decide who can respond" body="Open a form to anyone with the link, or ask for a shared password, a signed-in account, an email on your domain or a personal signed link.">
            <Fit width={460} height={300}>
              <AccessRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A link preview that looks like the form" body="Shared links unfurl with the form's own title, description and cover image when people paste them into a chat or a post.">
            <Fit width={440} height={290}>
              <SharePreviewRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="payments"
        title="Take payment as part of the form"
        lead="Add products and an order total, then send people to Stripe Checkout when they submit. Charge once or by subscription, monthly or yearly, with coupon codes on top."
        link={{ label: "Geiger Forms", href: "/forms" }}
      >
        <Stage
          title="A signup form that sells the membership"
          body="Turn on payments, pick a currency and choose one-off or subscription billing. Respondents see the order total with any coupon applied, and their response waits as Awaiting payment until Stripe confirms it."
        >
          <Fit width={1000} height={620}>
            <CheckoutStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Coupons you can pause" body="Create percentage or fixed-amount codes for checkout, and switch any of them off without deleting it.">
            <Fit width={460} height={250}>
              <CouponsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every payment, on its response" body="Each response shows its amount, currency and checkout reference, and whether the payment is paid, pending, unpaid, failed, refunded or canceled.">
            <Fit width={460} height={300}>
              <PaymentsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="security"
        title="Safe from spam, open to your tools"
        lead="Keep bots out and sensitive answers encrypted, with a log of who looked. Then hand responses to the rest of your stack through an API and signed webhooks."
        link={{ label: "Geiger Forms", href: "/forms" }}
      >
        <Stage
          title="Sensitive answers stay locked until someone asks"
          body="Mark a field as sensitive and its answers are encrypted before they're stored and masked in the inbox and exports. Revealing one is a deliberate click, and every view, reveal, export and print is logged."
        >
          <Fit width={1000} height={620}>
            <SecurityStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Spam stops at the door" body="A hidden honeypot, a Cloudflare Turnstile check and a rate limit per device keep bots out, and duplicate detection flags repeat submissions.">
            <Fit width={460} height={290}>
              <SpamRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Keep only what you need" body="Delete responses automatically after a set number of days, collect anonymously, and answer access or erasure requests for any email address.">
            <Fit width={460} height={330}>
              <PrivacyRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A REST API with scoped keys" body="Read forms and responses or submit headlessly from your own code, with bearer API keys scoped to read or write.">
            <Fit width={460} height={290}>
              <ApiRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Webhooks you can replay" body="Signed webhooks fire when a response is created, updated or approved. Every delivery is logged, failed ones are retried, and you can replay any of them.">
            <Fit width={460} height={260}>
              <WebhooksRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
