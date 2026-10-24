"use client";

import { useLayoutEffect } from "react";
import { useIdleRecenter } from "@/lib/hooks/use-idle-recenter";

// Each help page mounts its own sidebar, so carry the scroll offset across client navigations.
let lastScrollTop = 0;

// Desktop nav rail: left idle with the current page off-centre, it glides that page back to centre.
export function HelpSidebar({ activeSlug, className, children }) {
  const { ref } = useIdleRecenter(activeSlug, { selector: "[aria-current='page']" });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    el.scrollTop = lastScrollTop;
    const remember = () => {
      lastScrollTop = el.scrollTop;
    };
    el.addEventListener("scroll", remember, { passive: true });
    return () => el.removeEventListener("scroll", remember);
  }, [ref]);

  return (
    <aside ref={ref} className={className}>
      {children}
    </aside>
  );
}
