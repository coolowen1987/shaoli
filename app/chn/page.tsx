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
  const [site, page] = await Promise.all([
    getSiteDetails("chn"),
    getMarkdownPage("about", "chn"),
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
    </div>
  );
}
