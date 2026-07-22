import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const dropboxCvUrl =
  "https://www.dropbox.com/scl/fi/pvqfbwzjbwevhbb4af5sm/cv.pdf?rlkey=i11lf1wbue17pe8n7kcu53msj&dl=0";

async function renderedHtml(page = "") {
  const relative = page ? `../out/${page}/index.html` : "../out/index.html";
  return readFile(new URL(relative, import.meta.url), "utf8");
}

test("static export renders the Markdown-driven academic pages", async () => {
  const [html, book] = await Promise.all([renderedHtml(), renderedHtml("book")]);

  assert.match(html, /<title>Welcome! · Academic Portfolio<\/title>/i);
  assert.match(html, /<h1[^>]*>Welcome!<\/h1>/i);
  assert.match(html, /I am a researcher working at the intersection of/i);
  assert.match(html, /I am currently/i);
  assert.match(html, /href="\/book\/"/i);
  assert.match(html, /href="\/papers\/"/i);
  assert.match(html, /href="\/data\/"/i);
  assert.match(html, /href="\/teaching\/"/i);
  assert.match(html, /src="\/profile\.jpg"/i);
  assert.doesNotMatch(html, /<figcaption[^>]*>Profile<\/figcaption>/i);
  assert.doesNotMatch(html, /Read profile|Curriculum vitae|dropbox\.com/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  assert.match(book, /<title>Book · Academic Portfolio<\/title>/i);
  assert.match(book, />Book</i);
});

test("keeps all page content in editable Markdown files", async () => {
  const names = ["site", "about", "book", "papers", "data", "teaching", "cv", "contact"];
  const files = await Promise.all(
    names.map((name) => readFile(new URL(`../content/${name}.md`, import.meta.url), "utf8")),
  );

  assert.match(files[0], /name:\s*\n/);
  assert.ok(files[0].includes(`dropbox_cv_url: "${dropboxCvUrl}"`));
  assert.ok(files.slice(1).every((file) => /^---[\s\S]*title:/m.test(file)));
  assert.ok(files.slice(1).every((file) => file.includes("<!--")));

  await Promise.all([
    access(new URL("../public/profile.jpg", import.meta.url)),
    access(new URL("../public/cv.pdf", import.meta.url)),
    access(new URL("../.github/workflows/pages.yml", import.meta.url)),
  ]);
  await assert.rejects(access(new URL("site.config.ts", projectRoot)));
});
