import { GitBranch, Mail, Ticket, Users } from "lucide-react";
import { Fit } from "@/components/features-hub/motion";
import styles from "@/components/features-hub/features_hub.module.css";

const NODES = [
  { id: "trigger", x: 16, y: 98, w: 140, kind: "Trigger", title: "Ticket purchased", Icon: Ticket, d: 0 },
  { id: "branch", x: 190, y: 98, w: 112, kind: "If", title: "Tier is VIP", Icon: GitBranch, d: 0.9 },
  { id: "email", x: 336, y: 34, w: 132, kind: "Then", title: "Send welcome email", Icon: Mail, d: 1.8 },
  { id: "segment", x: 336, y: 162, w: 132, kind: "Else", title: "Add to segment", Icon: Users, d: 1.8 },
];

const EDGES = [
  { d: "M156 123 L190 123", delay: 0 },
  { d: "M302 123 C322 123 316 59 336 59", delay: 0.9 },
  { d: "M302 123 C322 123 316 187 336 187", delay: 0.9 },
];

// An automation graph: a pulse leaves the trigger, passes the branch and fires both actions, every 3s.
export function NodesMotif() {
  return (
    <Fit width={484} height={250}>
      <svg width="484" height="250" className="absolute inset-0 overflow-visible">
        {EDGES.map((edge) => (
          <path key={edge.d} d={edge.d} fill="none" stroke="var(--ink)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="4 4" className={styles.dashFlow} />
        ))}
      </svg>
      {EDGES.map((edge) => (
        <span
          key={edge.d}
          className={`absolute top-0 left-0 size-2.5 rounded-full bg-(--ink) shadow-[0_0_12px_2px_color-mix(in_oklab,var(--ink)_40%,transparent)] ${styles.travel}`}
          style={{ offsetPath: `path("${edge.d}")`, "--d": `${edge.delay}s` }}
        />
      ))}
      {NODES.map(({ id, x, y, w, kind, title, Icon, d }) => (
        <div
          key={id}
          className={`absolute flex h-[50px] items-center gap-2.5 rounded-xl border border-border bg-surface-card px-3 shadow-lg shadow-black/5 ${styles.nodeFire}`}
          style={{ left: x, top: y, width: w, "--d": `${d}s` }}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-(--ink)/15">
            <Icon className="size-3.5 text-(--ink)" />
          </span>
          <span className="min-w-0">
            <span className="block font-mono text-[9px] tracking-[0.16em] text-text-tertiary uppercase">{kind}</span>
            <span className="block truncate text-[11px] font-medium text-foreground">{title}</span>
          </span>
        </div>
      ))}
    </Fit>
  );
}
