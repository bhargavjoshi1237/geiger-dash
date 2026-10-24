"use client";

import { useEffect, useRef, useState } from "react";
import { LoadingArea } from "@geiger/ui/screen-kit";

// Streams a product's live /<product>/playground route (served through the product rewrites) in a lazily mounted iframe, so the showcase never goes stale and needs no cloned code.
// With a `viewport` ({ width, height }) the app renders at that real size and scales down uniformly to the holder's width, so it stays to scale instead of reflowing into a cramped layout.
// `transparent` drops the holder's background so a page that renders transparently shows whatever sits behind the frame.
export function PlaygroundFrame({ src, title, viewport, loaderSize = 80, transparent = false, className = "", frameClassName = "" }) {
  const holder = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0);
  const width = viewport?.width;
  const height = viewport?.height;

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

  useEffect(() => {
    const node = holder.current;
    if (!node || !width) return undefined;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / width));
    observer.observe(node);
    return () => observer.disconnect();
  }, [width]);

  const scaled = Boolean(width && height);

  return (
    <div
      ref={holder}
      className={`relative w-full overflow-hidden ${transparent ? "" : "bg-background"} ${scaled ? "" : "h-full"} ${className}`}
      style={scaled ? { aspectRatio: `${width} / ${height}` } : undefined}
    >
      {!loaded ? (
        <LoadingArea size={loaderSize} label={`Loading ${title}`} className="absolute inset-0" />
      ) : null}
      {visible && (!scaled || scale) ? (
        <iframe
          src={src}
          title={title}
          onLoad={() => setLoaded(true)}
          className={`block border-0 transition-opacity duration-300 ${scaled ? "absolute left-0 top-0 origin-top-left" : "h-full w-full"} ${loaded ? "opacity-100" : "opacity-0"} ${frameClassName}`}
          style={scaled ? { width, height, transform: `scale(${scale})` } : undefined}
        />
      ) : null}
    </div>
  );
}

export default PlaygroundFrame;
