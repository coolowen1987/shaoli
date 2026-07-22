import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownContent } from "../components/MarkdownContent";
import { getMarkdownPage, getSiteDetails, pageSlugs, type PageSlug } from "../../lib/content";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return pageSlugs.map((slug) => ({ slug }));
}

function isPageSlug(value: string): value is Exclude<PageSlug, "about"> {
  return pageSlugs.includes(value as Exclude<PageSlug, "about">);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isPageSlug(slug)) return {};
  const [page, site] = await Promise.all([getMarkdownPage(slug), getSiteDetails()]);
  return {
    title: page.title ? { absolute: `${page.title} · ${site.name || "Academic Portfolio"}` } : undefined,
    description: page.summary || undefined,
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isPageSlug(slug)) notFound();

  const [page, site] = await Promise.all([getMarkdownPage(slug), getSiteDetails()]);
  const cvHref = site.dropboxCvUrl || `${basePath}/cv.pdf`;
  const index = String(pageSlugs.indexOf(slug) + 2).padStart(2, "0");
  const links = [
    ["Google Scholar", site.googleScholarUrl],
    ["ORCID", site.orcidUrl],
    ["GitHub", site.githubUrl],
  ].filter(([, url]) => url);

  return (
    <div id="top" className="inner-page">
      <header className="page-hero">
        <p className="eyebrow">{page.eyebrow}</p>
        <div className="page-title-row">
          <span>{index}</span>
          <h1>{page.title}</h1>
        </div>
        {page.summary ? <p>{page.summary}</p> : <span className="blank blank-summary" aria-hidden="true" />}
      </header>

      <section className="markdown-section inner-content">
        <MarkdownContent page={page} />

        {slug === "cv" ? (
          <a className="button button-primary page-action" href={cvHref} target="_blank" rel="noreferrer">
            Open CV <span aria-hidden="true">↗</span>
          </a>
        ) : null}

        {slug === "contact" ? (
          <div className="contact-details">
            <div>
              <p className="mini-label">Email</p>
              {site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : <span className="blank blank-contact" />}
            </div>
            <div>
              <p className="mini-label">Office</p>
              {site.office || <span className="blank blank-contact" />}
            </div>
            <div>
              <p className="mini-label">Elsewhere</p>
              {links.length ? links.map(([label, url]) => (
                <a href={url} target="_blank" rel="noreferrer" key={label}>{label}</a>
              )) : <span className="blank blank-contact" />}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
