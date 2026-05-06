import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TABS = ["Host", "Members", "Join", "Merge"];

function CollaboratorWindow({ title, activeTab, className = "", children }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#2f2f2f] bg-[#121212] shadow-[0_32px_80px_-40px_rgba(0,0,0,0.95)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#252525] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2f2f2f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2f2f2f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2f2f2f]" />
        </div>
        <p className="text-[11px] text-[#7b7b7b]">{title}</p>
        <span className="w-8" />
      </div>

      <div className="flex border-b border-[#252525] px-2 py-1.5">
        {TABS.map((tab) => (
          <span
            key={tab}
            className={`rounded-md px-2.5 py-1 text-[10px] uppercase tracking-wide ${
              activeTab === tab
                ? "bg-[#f4f4f4] text-[#111111]"
                : "text-[#888888]"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}

export default function CollaboratorTabsShowcase({ ctaHref, ctaLabel }) {
  return (
    <section className="rounded-sm border border-[#212121] bg-[#161616] p-4 sm:p-6 md:p-8 xl:p-10">
      <div className="grid items-center gap-12 lg:grid-cols-[0.36fr_0.64fr]">
        <div className="space-y-5">
          <h3 className="text-2xl font-semibold leading-snug text-[#f5f5f5] sm:text-3xl">
            Collaborate in Real-Time to Pplan & Execute.
          </h3>
          <p className="text-base text-[#bcbcbc] sm:text-lg">
            Invite your team to collaborate in real-time, ensuring everyone stays aligned while you plan and execute together.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 font-medium text-[#ee6b3b] transition-colors hover:text-[#ff8052]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-xl border border-[#2f2f2f] bg-[#101010] p-3">
          <div
            className="relative h-[420px] overflow-hidden rounded-lg border border-[#2b2b2b] bg-cover bg-center bg-no-repeat p-3 sm:h-[520px] sm:p-4 md:h-[580px] md:p-6"
            style={{
              backgroundImage:
                "url('https://cursor.com/marketing-static/_next/image?url=https%3A%2F%2Fptht05hbb1ssoooe.public.blob.vercel-storage.com%2Fassets%2Finternal-brand%2Finternal-brand-023-3291bb4c.jpg&w=1920&q=70')",
            }}
          >
            <div className="absolute inset-0 bg-black/12" />
            <CollaboratorWindow
              title="geiger-notes/collaborate"
              activeTab="Host"
              className="absolute left-3 top-3 z-10 w-[84%] sm:left-4 sm:top-5 sm:w-[72%] md:left-8 md:top-8"
            >
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#707070]">
                  Session Active
                </p>
                <div className="flex items-center justify-between rounded-md border border-[#2f2f2f] bg-[#171717] px-3 py-2">
                  <span className="font-mono text-xs tracking-[0.14em] text-[#e9e9e9]">
                    GEIGER-4G7Q-2M9A
                  </span>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-[#8b8b8b]">
                  Share this code with your team to join instantly.
                </p>
              </div>
            </CollaboratorWindow>

            <CollaboratorWindow
              title="geiger-notes/collaborate"
              activeTab="Members"
              className="absolute right-3 bottom-3 z-20 w-[90%] sm:bottom-5 sm:w-[80%] md:right-8 md:bottom-8"
            >
              <div className="space-y-2">
                {[
                  { name: "You", role: "Host", state: "online" },
                  { name: "Aanya", role: "Editor", state: "online" },
                  { name: "Ravi", role: "Viewer", state: "idle" },
                ].map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between rounded-md border border-[#2e2e2e] bg-[#171717] px-3 py-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#3a3a3a] text-xs text-[#d7d7d7]">
                        {member.name.slice(0, 1)}
                      </span>
                      <div>
                        <p className="text-sm text-[#ececec]">{member.name}</p>
                        <p className="text-[11px] text-[#878787]">{member.role}</p>
                      </div>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        member.state === "online" ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                  </div>
                ))}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-md border border-[#2f2f2f] bg-[#161616] px-2.5 py-2 text-center text-[11px] text-[#929292]">
                    Join Tab
                  </div>
                  <div className="rounded-md border border-[#2f2f2f] bg-[#161616] px-2.5 py-2 text-center text-[11px] text-[#929292]">
                    Merge Tab
                  </div>
                </div>
              </div>
            </CollaboratorWindow>

            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
