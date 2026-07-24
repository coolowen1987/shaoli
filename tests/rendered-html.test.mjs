import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { marked } from "marked";

const projectRoot = new URL("../", import.meta.url);
const dropboxCvUrl =
  "https://www.dropbox.com/scl/fi/pvqfbwzjbwevhbb4af5sm/cv.pdf?rlkey=i11lf1wbue17pe8n7kcu53msj&dl=0";

async function renderedHtml(page = "") {
  const relative = page ? `../out/${page}/index.html` : "../out/index.html";
  return readFile(new URL(relative, import.meta.url), "utf8");
}

function markdownBody(source) {
  const normalized = source.replace(/^\uFEFF/, "");
  const closing = normalized.indexOf("\n---\n", 4);
  return closing === -1 ? normalized : normalized.slice(closing + 5);
}

test("static export renders the Markdown-driven academic pages", async () => {
  const [html, research, teaching, aboutSource] = await Promise.all([
    renderedHtml(),
    renderedHtml("research"),
    renderedHtml("teaching"),
    readFile(new URL("../content/about.md", import.meta.url), "utf8"),
  ]);
  const expectedAboutHtml = await marked.parse(markdownBody(aboutSource), { gfm: true });

  assert.match(html, /<title>Welcome! · Academic Portfolio<\/title>/i);
  assert.match(html, /<h1[^>]*>Welcome!<\/h1>/i);
  assert.match(html, /Li Shao, a Political Scientest/i);
  assert.ok(html.includes(expectedAboutHtml));
  assert.match(html, /href="\/research\/"/i);
  assert.match(html, /href="\/teaching\/"/i);
  assert.doesNotMatch(html, /href="\/(?:book|papers|data)\/"/i);
  assert.match(html, /src="\/profile\.jpg"/i);
  assert.doesNotMatch(html, /<figcaption[^>]*>Profile<\/figcaption>/i);
  assert.doesNotMatch(html, /Read profile|Curriculum vitae|dropbox\.com/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  assert.match(research, /<title>Research · Academic Portfolio<\/title>/i);
  assert.match(research, />Research</i);
  assert.match(research, /class="content-page content-page-research"/i);
  assert.doesNotMatch(research, /class="(?:page-hero|markdown-section)/i);
  assert.match(teaching, /class="content-page content-page-teaching"/i);
  assert.match(teaching, /<a href="https:\/\/www\.dropbox\.com\/[^"]+">Syllabus<\/a>/i);
});

test("keeps all page content in editable Markdown files", async () => {
  const names = ["site", "about", "research", "teaching", "cv", "contact"];
  const [files, css] = await Promise.all([
    Promise.all(
      names.map((name) => readFile(new URL(`../content/${name}.md`, import.meta.url), "utf8")),
    ),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(files[0], /name:\s*\n/);
  assert.match(files[0], /wordmark:\s*"Li Shao, a Political Scientest"/);
  assert.ok(files[0].includes(`dropbox_cv_url: "${dropboxCvUrl}"`));
  assert.ok(files.slice(1).every((file) => /^---[\s\S]*title:/m.test(file)));
  assert.ok(files.slice(1).every((file) => file.includes("<!--")));
  assert.match(css, /\.about-hero\s*{[^}]*align-items:\s*start;/s);
  assert.match(css, /\.site-header\s*{[^}]*padding:\s*0 7vw;/s);
  assert.match(css, /\.about-hero\s*{[^}]*width:\s*100%;[^}]*padding:[^;]*7vw/s);
  assert.match(css, /\.content-page\s*{[^}]*padding:[^;]*7vw[^}]*background:\s*var\(--paper\);/s);
  assert.match(css, /\.markdown-body ul\s*{[^}]*list-style:\s*none;/s);
  assert.match(css, /\.markdown-body ul > li::before\s*{[^}]*content:\s*"▶";/s);
  assert.match(css, /\.content-page-research \.markdown-body a\s*{[^}]*border-bottom-color:\s*transparent;/s);
  assert.match(css, /\.content-page-research \.markdown-body a:hover,[^}]*border-bottom-color:\s*currentColor;/s);
  assert.match(css, /\.content-page-teaching \.markdown-body h3 a\s*{[^}]*border-bottom-color:\s*transparent;/s);
  assert.match(css, /\.content-page-teaching \.markdown-body h3 a:hover,[^}]*border-bottom-color:\s*currentColor;/s);
  assert.match(css, /\.content-page-teaching \.markdown-body > h1\s*{[^}]*margin:\s*clamp\(4rem,\s*6vw,\s*5rem\)\s*0\s*2rem;/s);
  assert.match(css, /\.content-page-teaching \.markdown-body > h2\s*{[^}]*border-top:\s*0;/s);
  assert.match(css, /footer\s*{[^}]*padding:\s*1\.5rem 7vw;/s);

  await Promise.all([
    access(new URL("../public/profile.jpg", import.meta.url)),
    access(new URL("../public/cv.pdf", import.meta.url)),
    access(new URL("../.github/workflows/pages.yml", import.meta.url)),
  ]);
  await Promise.all(
    ["book", "papers", "data"].flatMap((name) => [
      assert.rejects(access(new URL(`../content/${name}.md`, import.meta.url))),
      assert.rejects(access(new URL(`../out/${name}/index.html`, import.meta.url))),
    ]),
  );
  await assert.rejects(access(new URL("site.config.ts", projectRoot)));
});
