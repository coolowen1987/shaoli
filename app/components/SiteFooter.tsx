"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { SiteDetails } from "../../lib/content";

export function SiteFooter({ site, chineseSite }: { site: SiteDetails; chineseSite: SiteDetails }) {
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const routePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname;
  const isChinese = routePath === "/chn" || routePath.startsWith("/chn/");
  const activeSite = isChinese ? chineseSite : site;

  useEffect(() => {
    document.documentElement.lang = isChinese ? "zh-CN" : "en";
  }, [isChinese]);

  return (
    <footer>
      <span>{activeSite.name || <span className="blank blank-footer" aria-hidden="true" />}</span>
      <span>{isChinese ? "学术主页 · GitHub Pages" : "Academic portfolio · GitHub Pages"}</span>
      <a href="#top">{isChinese ? "返回顶部 ↑" : "Back to top ↑"}</a>
    </footer>
  );
}
