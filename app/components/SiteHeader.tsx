"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteDetails } from "../../lib/content";

const englishNavigation = [
  ["About", "/"],
  ["Research", "/research/"],
  ["Teaching", "/teaching/"],
  ["CV", "/cv/"],
  ["Contact", "/contact/"],
] as const;

const chineseNavigation = [
  ["关于", "/chn/"],
  ["研究", "/chn/research/"],
  ["教学", "/chn/teaching/"],
  ["简历", "/chn/cv/"],
  ["联系", "/chn/contact/"],
] as const;

function Wordmark({ name }: { name: string }) {
  return name ? <>{name}</> : <span className="blank blank-wordmark" aria-hidden="true" />;
}

export function SiteHeader({ site, chineseSite }: { site: SiteDetails; chineseSite: SiteDetails }) {
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const routePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname;
  const isChinese = routePath === "/chn" || routePath.startsWith("/chn/");
  const activeSite = isChinese ? chineseSite : site;
  const navigation = isChinese ? chineseNavigation : englishNavigation;
  const englishPath = routePath.replace(/^\/chn(?=\/|$)/, "") || "/";
  const chinesePath = routePath === "/" ? "/chn/" : `/chn${routePath}`;
  const languageHref = isChinese ? englishPath : chinesePath;
  const languageLabel = isChinese ? "English" : "中文";

  return (
    <header className="site-header">
      <Link className="wordmark" href={isChinese ? "/chn/" : "/"} aria-label={isChinese ? "中文首页" : "Home"}>
        <Wordmark name={activeSite.wordmark || activeSite.name} />
      </Link>

      <nav className="desktop-nav" aria-label={isChinese ? "主导航" : "Primary navigation"}>
        {navigation.map(([label, href]) => (
          <Link href={href} key={href}>{label}</Link>
        ))}
        <Link className="language-switch" href={languageHref} lang={isChinese ? "en" : "zh-CN"}>
          {languageLabel}
        </Link>
      </nav>

      <details className="mobile-nav">
        <summary>{isChinese ? "菜单" : "Menu"}</summary>
        <nav aria-label={isChinese ? "移动端导航" : "Mobile navigation"}>
          {navigation.map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
          <Link className="language-switch" href={languageHref} lang={isChinese ? "en" : "zh-CN"}>
            {languageLabel}
          </Link>
        </nav>
      </details>
    </header>
  );
}
