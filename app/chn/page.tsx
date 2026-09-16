import type { Metadata } from "next";
import { getMarkdownPage, getSiteDetails } from "../../lib/content";
import { MarkdownContent } from "../components/MarkdownContent";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export async function generateMetadata(): Promise<Metadata> {
  const [site, page] = await Promise.all([
    getSiteDetails("chn"),
    getMarkdownPage("about", "chn"),
  ]);

  return {
    title: { absolute: `${page.title} · ${site.name || "学术主页"}` },
    description: page.summary || "邵立的个人学术主页",
  };
}

export default async function ChineseHome() {
  const [site, page, news] = await Promise.all([
    getSiteDetails("chn"),
    getMarkdownPage("about", "chn"),
    getMarkdownPage("news", "chn"),
  ]);

  return (
    <div id="top" lang="zh-CN">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-inner">
          <div className="about-copy">
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 id="about-title">{page.title}</h1>
            <div className="about-introduction">
              <MarkdownContent page={page} />
            </div>
          </div>

          <div className="about-portrait">
            <img
              className="about-portrait-image"
              src={`${basePath}/profile.jpg`}
              alt={site.name ? `${site.name}的肖像` : "个人肖像"}
              width="614"
              height="899"
            />
          </div>
        </div>
      </section>

      <section className="news-section" aria-labelledby="news-title">
        <div className="news-section-inner">
          {news.eyebrow ? <p className="eyebrow">{news.eyebrow}</p> : null}
          <h2 id="news-title">{news.title}</h2>
          {news.summary ? <p className="news-summary">{news.summary}</p> : null}
          <div className="news-list">
            <MarkdownContent page={news} />
          </div>
        </div>
      </section>
    </div>
  );
}
