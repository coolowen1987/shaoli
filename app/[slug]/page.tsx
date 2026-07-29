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

  return (
    <div id="top" className="inner-page">
      <section className={`content-page content-page-${slug}`} aria-labelledby="content-page-title">
        <div className="content-page-copy">
          {page.eyebrow ? <p className="eyebrow">{page.eyebrow}</p> : null}
          <h1 id="content-page-title">{page.title}</h1>
          {page.summary ? <p className="content-page-summary">{page.summary}</p> : null}

          <div className="content-page-body">
            <MarkdownContent page={page} />
          </div>

          {slug === "cv" ? (
            <a className="button button-primary page-action" href={cvHref} target="_blank" rel="noreferrer">
              Open CV <span aria-hidden="true">↗</span>
            </a>
          ) : null}

        </div>
      </section>
    </div>
  );
}
