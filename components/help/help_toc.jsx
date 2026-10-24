"use client";

// Glides to the section instead of jumping, keeps the hash in the URL, and leaves modified clicks (new tab) alone.
function scrollToSection(event, href) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(decodeURIComponent(href.slice(1)));
  if (!target) return;
  event.preventDefault();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  window.history.pushState(null, "", href);
}

export function HelpToc({ links }) {
  return (
    // -mt-1 offsets the first link's py-1 so its text lines up with the article eyebrow.
    <nav aria-label="On this page" className="-mt-1">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={(event) => scrollToSection(event, link.href)}
          className="block py-1 text-sm leading-5 text-text-secondary transition-colors hover:text-foreground"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
