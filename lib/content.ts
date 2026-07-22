import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

export const pageSlugs = ["book", "papers", "data", "teaching", "cv", "contact"] as const;
export type PageSlug = (typeof pageSlugs)[number] | "about";

export type SiteDetails = {
  name: string;
  title: string;
  affiliation: string;
  location: string;
  email: string;
  office: string;
  dropboxCvUrl: string;
  googleScholarUrl: string;
  orcidUrl: string;
  githubUrl: string;
};

export type MarkdownPage = {
  slug: PageSlug;
  title: string;
  eyebrow: string;
  summary: string;
  html: string;
  isEmpty: boolean;
};

const contentDirectory = path.join(process.cwd(), "content");

function parseFrontMatter(source: string) {
  const normalized = source.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---\n")) return { data: {} as Record<string, string>, content: normalized };

  const closing = normalized.indexOf("\n---\n", 4);
  if (closing === -1) return { data: {} as Record<string, string>, content: normalized };

  const data: Record<string, string> = {};
  for (const line of normalized.slice(4, closing).split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    if (key) data[key] = value;
  }

  return { data, content: normalized.slice(closing + 5) };
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function getSiteDetails(): Promise<SiteDetails> {
  const source = await readFile(path.join(contentDirectory, "site.md"), "utf8");
  const { data } = parseFrontMatter(source);

  return {
    name: text(data.name),
    title: text(data.title),
    affiliation: text(data.affiliation),
    location: text(data.location),
    email: text(data.email),
    office: text(data.office),
    dropboxCvUrl: text(data.dropbox_cv_url),
    googleScholarUrl: text(data.google_scholar_url),
    orcidUrl: text(data.orcid_url),
    githubUrl: text(data.github_url),
  };
}

export async function getMarkdownPage(slug: PageSlug): Promise<MarkdownPage> {
  const source = await readFile(path.join(contentDirectory, `${slug}.md`), "utf8");
  const { data, content } = parseFrontMatter(source);
  const visibleMarkdown = content.replace(/<!--[\s\S]*?-->/g, "").trim();

  return {
    slug,
    title: text(data.title),
    eyebrow: text(data.eyebrow),
    summary: text(data.summary),
    html: await marked.parse(content, { gfm: true }),
    isEmpty: !visibleMarkdown,
  };
}
