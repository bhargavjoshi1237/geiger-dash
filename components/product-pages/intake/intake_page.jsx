import { AreaHero, AreaPage, AreaSection, FeatureCell, FeatureGrid, Fit, HeroArt, Stage } from "@/components/product-pages/area_kit";
import { CopilotRender, InboxStage, InboxWindow, MacroRender, SlaRender, WorkflowRender } from "@/components/product-pages/intake/comms_renders";
import { ConversationalForm, FormsStage, FunnelRender, LogicRender, SpamRender } from "@/components/product-pages/intake/forms_renders";
import { QuestionsRender, RegistrationsStage, WaitlistRender } from "@/components/product-pages/intake/events_renders";
import { TriageStage } from "@/components/product-pages/intake/flow_renders";

// /intake: where conversations, responses, registrations and new issues land across the suite.
export function IntakePage() {
  return (
    <AreaPage area="intake">
      <AreaHero
        title="Every request has somewhere to land"
        art={
          <HeroArt focus={["66%", "44%"]} plane={{ "--plane-top": "-34%" }}>
            <InboxWindow typed="Thanks Maya, the updated invoice is on its way" />
          </HeroArt>
        }
      />

      <AreaSection
        id="conversations"
        title="Every conversation, one shared inbox"
        lead="Customers write from the Messenger on your site. Your team works the thread together, with assignment, internal notes, snoozes and tickets in one queue."
        link={{ label: "Geiger Comms", href: "/comms" }}
      >
        <Stage title="One thread per customer, seen by the whole team" body="Messenger conversations arrive in a shared queue. Assign them, leave an internal note with an @mention, and turn the thread into a ticket when it needs back-office work.">
          <Fit width={1000} height={620}>
            <InboxStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="Write the reply, then let Copilot polish it" body="Rephrase, shorten or warm up a draft, fix the grammar or translate it into the customer's language, with an undo for every rewrite.">
            <Fit width={460} height={300}>
              <CopilotRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Escalate without a second look" body="Workflows run on triggers like a new conversation, check conditions like priority, then assign, apply an SLA and leave a note.">
            <Fit width={420} height={312}>
              <WorkflowRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Hold the line on response times" body="SLA policies count first response, next response and resolution inside your business hours, and warn the team before a deadline slips.">
            <Fit width={460} height={300}>
              <SlaRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Answer the common questions in a keystroke" body="Type # to pull in a macro with the customer's name filled in. Macros can tag, assign or close the conversation when you send.">
            <Fit width={460} height={300}>
              <MacroRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="forms"
        title="Forms people actually finish"
        lead="Logic, formulas, payments and a one-question-at-a-time mode up front. Behind it, a response workspace with statuses, priorities, saved views and comments."
        link={{ label: "Geiger Forms", href: "/forms" }}
      >
        <Stage title="Work every response like a queue" body="Each submission lands with a status, a priority and an owner. Switch between table and kanban, save the filters you use every day, and talk it through in comments before you approve.">
          <Fit width={1000} height={520}>
            <FormsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="One question at a time" body="Conversational mode shows a single question per screen and moves on when the respondent presses Enter, so long forms feel short.">
            <Fit width={460} height={400}>
              <ConversationalForm />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Logic that follows the answers" body="Show or skip questions based on earlier answers, and compute values with IF, SUM, ROUND and the rest of the formula functions.">
            <Fit width={460} height={330}>
              <LogicRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="See where people give up" body="The funnel follows every form from viewed to started to submitted, and field drop-off points at the question that loses people.">
            <Fit width={460} height={340}>
              <FunnelRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Keep the bots out" body="A honeypot, Cloudflare Turnstile, rate limits and duplicate detection stop junk before it reaches anyone's queue.">
            <Fit width={440} height={280}>
              <SpamRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="registrations"
        title="Registrations that sort themselves out"
        lead="Ask the questions you need, approve who gets in, and let the waitlist fill every place that opens up."
        link={{ label: "Geiger Events", href: "/events" }}
      >
        <Stage title="Approve guests before they're confirmed" body="Put an approval gate on any event. Every registration shows its answers, dietary and accessibility needs, and where it came from, so you can approve or decline in one click.">
          <Fit width={1000} height={520}>
            <RegistrationsStage />
          </Fit>
        </Stage>
        <FeatureGrid>
          <FeatureCell title="A waitlist that promotes itself" body="When a place opens, the next guest is promoted automatically and gets a claim window before the spot moves on.">
            <Fit width={440} height={290}>
              <WaitlistRender />
            </Fit>
          </FeatureCell>
          <FeatureCell title="Questions that appear when they matter" body="Registration questions can depend on earlier answers, like asking for a talk title only from guests who want a lightning-talk slot.">
            <Fit width={440} height={330}>
              <QuestionsRender />
            </Fit>
          </FeatureCell>
        </FeatureGrid>
      </AreaSection>

      <AreaSection
        id="triage"
        title="Triage before it becomes work"
        lead="New issues wait in Flow's triage queue until someone decides on them. Accept the good ones into Todo and decline the rest, one at a time or all at once."
        link={{ label: "Geiger Flow", href: "/flow" }}
      >
        <Stage title="A clear queue for everything unplanned" body="Triage collects every new issue that has no owner yet. Give it a priority, labels, an owner and a cycle as you accept it, and it joins the team's plan.">
          <Fit width={1000} height={540}>
            <TriageStage />
          </Fit>
        </Stage>
      </AreaSection>
    </AreaPage>
  );
}
