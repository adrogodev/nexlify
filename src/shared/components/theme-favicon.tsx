"use client";

import { useEffect } from "react";

function setFavicon(href: string) {
  const existing = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.rel = "icon";
  link.href = href;
  document.head.appendChild(link);
}

export function ThemeFavicon() {
  useEffect(() => {
    const update = () => {
      const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
      setFavicon(isDark ? "/nexlifly-dark.svg" : "/nexlifly.svg");
    };

    update();
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return null;
}
