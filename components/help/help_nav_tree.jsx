import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Hook-free so it renders in the server sidebar and inside the client mobile sheet alike.
function NavLink({ link, isActive, onNavigate, children }) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm font-medium leading-5 transition-colors ${
        isActive ? "bg-surface-card text-foreground" : "text-muted-foreground hover:bg-surface-card hover:text-foreground"
      }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate">{link.label}</span>
        {link.draft ? (
          <span className="shrink-0 rounded border border-border px-1 text-[10px] font-medium uppercase text-text-tertiary">
            Draft
          </span>
        ) : null}
      </span>
      {children}
    </Link>
  );
}

export function HelpNavTree({ navigation, activeSlug, onNavigate }) {
  return (
    <nav className="space-y-8">
      {navigation.map((group) => (
        <div key={group.title}>
          <p className="mb-3 text-xs font-medium uppercase text-text-secondary">{group.title}</p>
          <div className="space-y-1">
            {group.links.map((link) => {
              const expanded =
                link.children.length > 0 &&
                (link.slug === activeSlug || link.children.some((child) => child.slug === activeSlug));
              return (
                <div key={link.slug}>
                  <NavLink link={link} isActive={link.slug === activeSlug} onNavigate={onNavigate}>
                    {link.children.length ? (
                      <ChevronRight
                        className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`}
                      />
                    ) : null}
                  </NavLink>
                  {expanded ? (
                    <div className="ml-3 mt-1 space-y-1 border-l border-border pl-2">
                      {link.children.map((child) => (
                        <NavLink
                          key={child.slug}
                          link={child}
                          isActive={child.slug === activeSlug}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
