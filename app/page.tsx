import type { Metadata } from "next";
import { getMarkdownPage, getSiteDetails } from "../lib/content";
import { MarkdownContent } from "./components/MarkdownContent";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteDetails();
  return { title: { absolute: `Welcome! · ${site.name || "Academic Portfolio"}` } };
}

export default async function Home() {
  const [site, page] = await Promise.all([getSiteDetails(), getMarkdownPage("about")]);

  return (
    <div id="top">
      <section className="about-hero" aria-labelledby="about-title">
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
            alt={site.name ? `Portrait of ${site.name}` : "Profile portrait"}
            width="614"
            height="899"
          />
        </div>
      </section>
    </div>
  );
}
