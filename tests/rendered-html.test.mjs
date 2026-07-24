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
  const [html, research] = await Promise.all([renderedHtml(), renderedHtml("research")]);

  assert.match(html, /<title>Welcome! · Academic Portfolio<\/title>/i);
  assert.match(html, /<h1[^>]*>Welcome!<\/h1>/i);
  assert.match(html, /Li Shao, a Political Scientest/i);
  assert.match(html, /Li Shao/i);
  assert.match(html, /My research focuses on/i);
  assert.match(
    html,
    /<a href="https:\/\/journals\.sagepub\.com\/home\/acp">Asian Journal of Comparative Politics<\/a>/i,
  );
  assert.match(html, /href="\/research\/"/i);
  assert.match(html, /href="\/teaching\/"/i);
  assert.doesNotMatch(html, /href="\/(?:book|papers|data)\/"/i);
  assert.match(html, /src="\/profile\.jpg"/i);
  assert.doesNotMatch(html, /<figcaption[^>]*>Profile<\/figcaption>/i);
  assert.doesNotMatch(html, /Read profile|Curriculum vitae|dropbox\.com/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  assert.match(research, /<title>Research · Academic Portfolio<\/title>/i);
  assert.match(research, />Research</i);
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
