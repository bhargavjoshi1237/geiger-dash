import { CreditCard, FolderKanban, Globe, KeyRound, Users } from "lucide-react";
import { SectionHeading } from "@/components/landing/section_heading";

// What every app inherits from the account, so it's configured once.
const SHARED = [
  { icon: KeyRound, title: "Sign-in", body: "One Geiger account opens every app. Add your own SSO provider when the organisation needs it." },
  { icon: Users, title: "Team", body: "Invite people to the organisation once. They arrive in each app you switch on." },
  { icon: FolderKanban, title: "Projects", body: "Every app files its work under the same projects, so a launch stays one launch." },
  { icon: CreditCard, title: "Billing", body: "One plan and one invoice. Turn on another app from billing instead of opening a new account." },
  { icon: Globe, title: "Address", body: "Put the whole workspace on yourname.geiger.studio." },
];

export function SharedLayer() {
  return (
    <section className="border-y border-border bg-surface-subtle">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            className="lg:sticky lg:top-28"
            title="Set it up once. Every app picks it up."
            description="The account does the boring parts, so a new app starts with your people and settings already in place."
          />
        </div>

        <dl className="divide-y divide-border border-y border-border lg:col-span-7">
          {SHARED.map(({ icon: Icon, title, body }) => (
            <div key={title} className="grid gap-2 py-7 sm:grid-cols-[11rem_1fr] sm:gap-8">
              <dt className="flex items-center gap-3 text-base font-semibold text-foreground">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {title}
              </dt>
              <dd className="text-base leading-relaxed text-text-secondary dark:text-muted-foreground">{body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default SharedLayer;
