"use client";

import { useEffect, useRef, useState } from "react";
import { LoadingArea } from "@geiger/ui/screen-kit";

// Streams a product's live /<product>/playground route (served through the product rewrites) in a lazily mounted iframe, so the showcase never goes stale and needs no cloned code.
export function PlaygroundFrame({ src, title, className = "", frameClassName = "" }) {
  const holder = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = holder.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={holder} className={`relative h-full w-full overflow-hidden bg-background ${className}`}>
      {!loaded ? (
        <LoadingArea size={80} label={`Loading ${title}`} className="absolute inset-0" />
      ) : null}
      {visible ? (
        <iframe
          src={src}
          title={title}
          onLoad={() => setLoaded(true)}
          className={`block h-full w-full border-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${frameClassName}`}
        />
      ) : null}
    </div>
  );
}

export default PlaygroundFrame;
