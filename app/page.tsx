import type { Metadata } from "next";
import { getMarkdownPage, getSiteDetails } from "../lib/content";
import { MarkdownContent } from "./components/MarkdownContent";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteDetails();
  return { title: { absolute: `About · ${site.name || "Academic Portfolio"}` } };
}

function IdentityLine({ value, size }: { value: string; size: "long" | "medium" | "short" }) {
  return value ? <>{value}</> : <span className={`blank blank-line ${size}`} aria-hidden="true" />;
}

export default async function Home() {
  const [site, page] = await Promise.all([getSiteDetails(), getMarkdownPage("about")]);
  const cvHref = site.dropboxCvUrl || `${basePath}/cv.pdf`;

  return (
    <div id="top">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="portrait-wrap">
          <img
            className="portrait"
            src={`${basePath}/profile.jpg`}
            alt={site.name ? `Portrait of ${site.name}` : "Profile portrait"}
            width="614"
            height="899"
          />
          <span className="portrait-index">01 / PROFILE</span>
        </div>

        <div className="home-copy">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 id="home-title" aria-label={site.name || "Name"}>
            {site.name || <span className="blank blank-name" aria-hidden="true" />}
          </h1>
          <div className="identity-lines">
            <p><IdentityLine value={site.title} size="long" /></p>
            <p><IdentityLine value={site.affiliation} size="medium" /></p>
            <p><IdentityLine value={site.location} size="short" /></p>
          </div>
          {page.summary ? <p className="home-summary">{page.summary}</p> : <span className="blank-paragraph" aria-hidden="true" />}
          <div className="hero-actions">
            <a className="button button-primary" href="#about-content">Read profile</a>
            <a className="button button-secondary" href={cvHref} target="_blank" rel="noreferrer">Curriculum vitae</a>
          </div>
        </div>
      </section>

      <section className="markdown-section" id="about-content">
        <div className="page-kicker"><span>01</span><h2>{page.title}</h2></div>
        <MarkdownContent page={page} />
      </section>
    </div>
  );
}
