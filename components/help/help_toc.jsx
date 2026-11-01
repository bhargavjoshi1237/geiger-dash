"use client";

import { useEffect, useRef, useState } from "react";

// A section becomes current once its top passes this share of the viewport.
const ACTIVE_LINE = 0.3;
// A click's glide counts as finished after this long without a scroll event.
const GLIDE_IDLE_MS = 150;
const READER_INPUTS = ["wheel", "touchstart", "keydown", "pointerdown"];

// Glides to the section instead of jumping, keeps the hash in the URL, and leaves modified clicks (new tab) alone.
function scrollToSection(event, href) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const target = document.getElementById(decodeURIComponent(href.slice(1)));
  if (!target) return false;
  event.preventDefault();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  window.history.pushState(null, "", href);
  return true;
}

// The last section past the line; the end of the page counts as the last section, since a short one may never reach the line.
function findCurrentHref(links) {
  const scroller = document.documentElement;
  if (window.scrollY + window.innerHeight >= scroller.scrollHeight - 2) return links.at(-1)?.href;
  const line = window.innerHeight * ACTIVE_LINE;
  let current = links[0]?.href;
  for (const link of links) {
    const section = document.getElementById(decodeURIComponent(link.href.slice(1)));
    if (section && section.getBoundingClientRect().top <= line) current = link.href;
  }
  return current;
}

export function HelpToc({ links }) {
  const navRef = useRef(null);
  // A clicked link stays current through the glide ("gliding") and where it lands ("landed"), until the next scroll after that.
  const pinRef = useRef(null);
  const glideTimerRef = useRef(0);
  const [activeHref, setActiveHref] = useState(links[0]?.href);

  const settleGlide = () => {
    clearTimeout(glideTimerRef.current);
    glideTimerRef.current = setTimeout(() => {
      if (pinRef.current) pinRef.current = "landed";
    }, GLIDE_IDLE_MS);
  };

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      if (!pinRef.current) setActiveHref(findCurrentHref(links));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    const onScroll = () => {
      if (pinRef.current === "landed") pinRef.current = null;
      if (pinRef.current) settleGlide();
      schedule();
    };
    const unpin = () => {
      pinRef.current = null;
    };
    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    for (const type of READER_INPUTS) window.addEventListener(type, unpin, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(glideTimerRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      for (const type of READER_INPUTS) window.removeEventListener(type, unpin);
    };
  }, [links]);

  // A long list scrolls inside its own rail, so keep the current row visible there without moving the page.
  useEffect(() => {
    const row = navRef.current?.querySelector("[aria-current]");
    const rail = row?.closest("aside");
    if (!rail) return;
    const rowBox = row.getBoundingClientRect();
    const railBox = rail.getBoundingClientRect();
    if (rowBox.top < railBox.top) rail.scrollTop += rowBox.top - railBox.top;
    else if (rowBox.bottom > railBox.bottom) rail.scrollTop += rowBox.bottom - railBox.bottom;
  }, [activeHref]);

  return (
    // -mt-1 offsets the first link's py-1 so its text lines up with the article eyebrow.
    <nav ref={navRef} aria-label="On this page" className="-mt-1">
      {links.map((link) => {
        const active = link.href === activeHref;
        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={active ? "location" : undefined}
            onClick={(event) => {
              if (!scrollToSection(event, link.href)) return;
              pinRef.current = "gliding";
              settleGlide();
              setActiveHref(link.href);
            }}
            className={`block py-1 text-sm leading-5 transition-colors ${
              active ? "font-medium text-foreground" : "text-text-secondary hover:text-foreground"
            }`}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
