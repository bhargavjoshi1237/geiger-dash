import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Hook-free so it renders in the server sidebar and inside the client mobile sheet alike.
function NavLink({ link, isActive, onNavigate, children }) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center justify-between gap-2 rounded-md px-2 py-1 text-sm leading-5 transition-colors hover:bg-surface-hover hover:text-foreground ${
        isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
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
          <p className="mb-1.5 text-xs text-text-secondary">{group.title}</p>
          {/* Pulled out by the rows' px-2 so link text lines up with the group title while hover fills the full row. */}
          <div className="-mx-2">
            {group.links.map((link) => {
              const expanded =
                link.children.length > 0 &&
                (link.slug === activeSlug || link.children.some((child) => child.slug === activeSlug));
              return (
                <div key={link.slug}>
                  <NavLink link={link} isActive={link.slug === activeSlug} onNavigate={onNavigate}>
                    {link.children.length ? (
                      <ChevronRight
                        className={`size-3.5 shrink-0 text-text-secondary transition-transform ${expanded ? "rotate-90" : ""}`}
                      />
                    ) : null}
                  </NavLink>
                  {expanded ? (
                    <div className="ml-3 border-l border-border pl-2">
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
