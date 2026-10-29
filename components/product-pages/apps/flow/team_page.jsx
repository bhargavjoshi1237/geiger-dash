import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { findTourPage, findTour } from "@/components/product-pages/tours";
import {
  AccessHistoryRender,
  AccessLevelsRender,
  CallStage,
  ChannelStage,
  ChatWindow,
  FilesRender,
  IncomingCallRender,
  LockoutRender,
  NewSecretRender,
  PrivateChannelRender,
  ReminderRender,
  VaultStage,
} from "@/components/product-pages/apps/flow/team_renders";

const PAGE = findTourPage("flow", "team");
const FLOW = { label: "Geiger Flow", href: "/flow" };

// /apps/flow/team: Flow's Grounding chat and one-to-one calls, and the project vault.
export function FlowTeamPage() {
  return (
    <AreaPage area={PAGE.id} links={findTour("flow").pages} linksLabel="More from Geiger Flow">
      <AreaHero
        title={PAGE.headline}
        art={
          <HeroArt focus={["62%", "38%"]} plane={{ "--plane-top": "-2%", "--plane-left": "14%" }}>
            <ChatWindow />
          </HeroArt>
        }
      />

      <AreaSection
        id="chat"
        title="Talk it over beside the work"
        lead="Grounding is each project's chat: public and private channels, direct messages and threads, with messages, reactions and read receipts arriving live."
        link={FLOW}
      >
        <Stage
          title="Channels with threads, reactions and files"
          body="Reply to a message, start a thread on it, react, copy its text or check its details. Pin the conversations you live in to the top of the list."
        >
          <Fit width={1000} height={620}>
            <ChannelStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Private when it needs to be" body="Make a channel public so anyone can join, or private and invite-only, and add the right people as you create it.">
            <Fit width={460} height={410}>
              <PrivateChannelRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every file in one place" body="Attach files up to 25 MB to any message. The Files tab lists everything shared, with where it was shared and its size.">
            <Fit width={460} height={250}>
              <FilesRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="calls"
        title="Call a teammate from the chat"
        lead="Start a voice or video call from any direct message. It runs peer to peer in the browser, rings the other person, and leaves a record in the conversation."
        link={FLOW}
      >
        <Stage
          title="One-to-one calls, straight from the browser"
          body="Calls connect two people directly, with the microphone and camera a click away. Each one ends up in the conversation as a card, missed or not, with a button to call back."
        >
          <Fit width={1000} height={620}>
            <CallStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A ring you won't miss" body="An incoming call opens a dialog with the caller's name and whether it is audio or video, ready to accept or decline.">
            <Fit width={460} height={300}>
              <IncomingCallRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Reminders before a scheduled call" body="Schedule a call and, while Flow is open, a reminder lands in your chat inbox in the hour before it starts.">
            <Fit width={460} height={260}>
              <ReminderRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="vault"
        title="Keep the keys where the work is"
        lead="Each project has a vault for its passwords, API keys and credentials. Every secret is encrypted, opens only with its PIN, password or a passkey, and records who opened it."
        link={FLOW}
      >
        <Stage
          title="Secrets that stay locked until someone needs one"
          body="Store passwords, API keys, database logins, OAuth clients, SMTP settings, certificates and SSH keys. Opening one asks for its PIN or password, or your own passkey."
        >
          <Fit width={1000} height={620}>
            <VaultStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Choose who can open it" body="Let everyone in the project open a secret, only its managers, or managers plus the people you name by email.">
            <Fit width={460} height={355}>
              <AccessLevelsRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Five wrong tries and it locks" body="Each wrong PIN or password counts down. After five, the secret locks for 15 minutes.">
            <Fit width={460} height={290}>
              <LockoutRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Every attempt on the record" body="Each secret keeps its access history: who tried, with what, whether it opened, and when. Opening one is also written to the project's log.">
            <Fit width={460} height={250}>
              <AccessHistoryRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Pick how each secret unlocks" body="Choose the type when you add a secret, then whether it opens with a shared PIN or password, or each person's own passkey.">
            <Fit width={460} height={340}>
              <NewSecretRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>
    </AreaPage>
  );
}
