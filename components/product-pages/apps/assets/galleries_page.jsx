import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTour, findTourPage } from "@/components/product-pages/tours";
import {
  CreatorRender,
  DownloadsRender,
  GalleryAccessRender,
  GalleryEditorWindow,
  GalleryStage,
  LicensingStage,
  OrderRender,
  PasswordRender,
  RenewalsRender,
  RightsRender,
  RoyaltiesRender,
  StoreStage,
} from "@/components/product-pages/apps/assets/galleries_renders";

const PAGE = findTourPage("assets", "galleries");
const LINK = { label: "Geiger Assets", href: "/assets" };

// /apps/assets/galleries: galleries, the gallery store and licensing, around Cobalt Retail's lookbook and Hana Ito's prints.
export function AssetsGalleriesPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("assets").pages} linksLabel="More from Geiger Assets">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["70%", "42%"]} plane={{ "--plane-top": "-8%", "--plane-left": "18%" }}>
            <GalleryEditorWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="galleries"
        title="A gallery for every audience"
        lead="Build a gallery from a live collection or your own selection, pick one of six layouts, and publish it as public, unlisted or private."
        link={LINK}
      >
        <Stage
          title="Six layouts, one click apart"
          body="Choose grid, masonry, justified rows, mosaic, slideshow or a single column, pick a theme, and preview it with the same renderer the public page at /g/ uses."
        >
          <Fit width={1000} height={620}>
            <GalleryStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell
            title="Decide who sees it and what they take"
            body="Make a gallery public, unlisted or private, give it a password and an end date, and leave downloads open, on request or turned off."
          >
            <Fit width={460} height={300}>
              <GalleryAccessRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A password that holds" body="Cobalt Retail's press gallery asks for a password, and the check happens on the server before any image is sent.">
            <Fit width={460} height={300}>
              <PasswordRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="sell"
        title="Sell prints and downloads"
        lead="Hana Ito sells her Harbour light series straight from her gallery. Buyers pay through Stripe Checkout, and every order keeps its receipt and download links."
        link={LINK}
      >
        <Stage
          title="Prices checked again at checkout"
          body="Buyers add prints and downloads to a cart and apply a discount code. Every price is worked out again on the server before Stripe Checkout takes the payment."
        >
          <Fit width={1000} height={620}>
            <StoreStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Every order, start to refund" body="Orders show what was bought, how it was paid and what has been delivered, with the receipt as a PDF and refunds a click away.">
            <Fit width={460} height={300}>
              <OrderRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Download links that keep count" body="Buyers get a download link for each file in the size they paid for. Each link has a use limit and an expiry date, and you can revoke it.">
            <Fit width={460} height={300}>
              <DownloadsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="license"
        title="License the work and track the money"
        lead="Record the rights you hold, issue licences with a fee from your rate card, catch what is about to expire, and work out what each rights holder is owed."
        link={LINK}
      >
        <Stage
          title="Licences priced from your rate card"
          body="Pick a licensee, a template, the usage, channels and territory. The fee is worked out from your pricing rules, and a conflict check flags clashes with exclusive grants or rights you don't hold."
        >
          <Fit width={1000} height={620}>
            <LicensingStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Know what you hold" body="The Rights Inventory records every right you own, commissioned or licensed in, with its holder, coverage and window.">
            <Fit width={460} height={300}>
              <RightsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Catch renewals in time" body="Expirations & Renewals lists the licences that are closing or in grace, with the revenue at risk. Renew them, extend the grace period or mark them lapsed.">
            <Fit width={460} height={300}>
              <RenewalsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Royalties worked out for you" body="Royalty rules turn licence revenue into what each rights holder is owed, from accrued to on a statement to paid.">
            <Fit width={460} height={300}>
              <RoyaltiesRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="A creator page for fans" body="Hana's page at /c/ has tiers, posts and a Tip button. Fans join a tier, send a tip or unlock a post, each with a one-time Stripe payment.">
            <Fit width={460} height={300}>
              <CreatorRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
