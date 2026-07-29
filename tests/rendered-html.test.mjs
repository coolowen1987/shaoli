import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { marked } from "marked";

const projectRoot = new URL("../", import.meta.url);
const syllabusFiles = [
  "zju_cp_syllabus.pdf",
  "zju_cp_syllabus_e_translate.pdf",
  "zju_cpi_syllabus.pdf",
  "zju_cpi_syllabus_e_translate.pdf",
  "zju_psr_syllabus2026.pdf",
  "syr_Syllabus_Intro_Political_Analysis.pdf",
  "zju_cp_simulation_chn.pdf",
  "zju_cp_simulation_eng.pdf",
];

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
  const [
    html,
    research,
    teaching,
    chineseHome,
    chineseResearch,
    chineseTeaching,
    aboutSource,
    chineseAboutSource,
  ] = await Promise.all([
    renderedHtml(),
    renderedHtml("research"),
    renderedHtml("teaching"),
    renderedHtml("chn"),
    renderedHtml("chn/research"),
    renderedHtml("chn/teaching"),
    readFile(new URL("../content/about.md", import.meta.url), "utf8"),
    readFile(new URL("../content/about_chn.md", import.meta.url), "utf8"),
  ]);
  const expectedAboutHtml = await marked.parse(markdownBody(aboutSource), { gfm: true });
  const expectedChineseAboutHtml = await marked.parse(markdownBody(chineseAboutSource), { gfm: true });

  assert.match(html, /<title>Welcome! · Academic Portfolio<\/title>/i);
  assert.match(html, /<h1[^>]*>Welcome!<\/h1>/i);
  assert.match(html, /Li Shao, a Political Scientest/i);
  assert.ok(html.includes(expectedAboutHtml));
  assert.match(html, /href="\/research\/"/i);
  assert.match(html, /href="\/teaching\/"/i);
  assert.match(html, /href="\/chn\/"[^>]*>中文<\/a>/i);
  assert.doesNotMatch(html, /href="\/(?:book|papers|data)\/"/i);
  assert.match(html, /src="\/profile\.jpg"/i);
  assert.doesNotMatch(html, /<figcaption[^>]*>Profile<\/figcaption>/i);
  assert.doesNotMatch(html, /Read profile|Curriculum vitae/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  assert.match(research, /<title>Research · Academic Portfolio<\/title>/i);
  assert.match(research, />Research</i);
  assert.match(research, /class="content-page content-page-research"/i);
  assert.doesNotMatch(research, /class="(?:page-hero|markdown-section)/i);
  assert.match(teaching, /class="content-page content-page-teaching"/i);
  for (const file of syllabusFiles) {
    assert.ok(teaching.includes(`href="../linkresource/${file}"`));
    assert.ok(chineseTeaching.includes(`href="../../linkresource/${file}"`));
  }
  assert.match(chineseHome, /<div id="top" lang="zh-CN">/i);
  assert.match(chineseHome, /class="about-hero"/i);
  assert.match(chineseHome, /<h1[^>]*>欢迎！<\/h1>/i);
  assert.ok(chineseHome.includes(expectedChineseAboutHtml));
  assert.match(chineseHome, /href="\/"[^>]*>English<\/a>/i);
  assert.match(chineseResearch, /<title>研究 · 邵立<\/title>/i);
  assert.match(chineseResearch, />信息治理</i);
  assert.match(chineseTeaching, /class="content-page content-page-teaching"/i);
});

test("teaching Markdown links every syllabus from the public site", async () => {
  const [teachingSource, chineseTeachingSource] = await Promise.all([
    readFile(new URL("../content/teaching.md", import.meta.url), "utf8"),
    readFile(new URL("../content/teaching_chn.md", import.meta.url), "utf8"),
  ]);
  const teachingHtml = await marked.parse(markdownBody(teachingSource), { gfm: true });
  const chineseTeachingHtml = await marked.parse(markdownBody(chineseTeachingSource), { gfm: true });

  for (const file of syllabusFiles) {
    assert.ok(teachingHtml.includes(`href="../linkresource/${file}"`));
    assert.ok(chineseTeachingHtml.includes(`href="../../linkresource/${file}"`));
    await access(new URL(`../public/linkresource/${file}`, import.meta.url));
  }
  assert.match(teachingHtml, /<li>Introduction to Comparative Politics[\s\S]*<ul>[\s\S]*Chinese Syllabus/i);
  assert.match(teachingHtml, /Parliament Simulation\(Chinese\)/i);
  assert.match(teachingHtml, /Parliament Simulation\(Translated in English\)/i);
  assert.match(
    teachingHtml,
    /<em>Sample syllabus, class evaluation and student comments are available upon request\.<\/em>/i,
  );
  assert.match(chineseTeachingHtml, /<em>课程大纲、课程评价及学生反馈可应要求提供。<\/em>/i);
});

test("keeps publication entries unchanged in the Chinese research Markdown", async () => {
  const [englishResearch, chineseResearch] = await Promise.all([
    readFile(new URL("../content/research.md", import.meta.url), "utf8"),
    readFile(new URL("../content/research_chn.md", import.meta.url), "utf8"),
  ]);
  const publicationLines = (source) =>
    markdownBody(source).split(/\r?\n/).filter((line) => line.startsWith("- "));

  assert.deepEqual(publicationLines(chineseResearch), publicationLines(englishResearch));
});

test("keeps all page content in editable Markdown files", async () => {
  const names = [
    "site",
    "about",
    "research",
    "teaching",
    "cv",
    "contact",
    "site_chn",
    "about_chn",
    "research_chn",
    "teaching_chn",
    "cv_chn",
    "contact_chn",
  ];
  const [files, css] = await Promise.all([
    Promise.all(
      names.map((name) => readFile(new URL(`../content/${name}.md`, import.meta.url), "utf8")),
    ),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(files[0], /name:\s*\n/);
  assert.match(files[0], /wordmark:\s*"Li Shao, a Political Scientest"/);
  assert.match(files[0], /dropbox_cv_url:\s*"https:\/\/www\.dropbox\.com\/[^"]+"/);
  assert.ok(files.filter((_, index) => ![0, 6].includes(index)).every((file) => /^---[\s\S]*title:/m.test(file)));
  assert.ok(files.slice(1).every((file) => file.includes("<!--")));
  assert.match(css, /\.about-hero\s*{[^}]*align-items:\s*start;/s);
  assert.match(css, /--site-max-width:\s*1320px;/);
  assert.match(css, /\.site-header,\s*main,\s*footer\s*{[^}]*width:\s*min\(100%,\s*var\(--site-max-width\)\);[^}]*margin-inline:\s*auto;/s);
  assert.match(css, /\.site-header\s*{[^}]*padding:\s*0 var\(--page-gutter\);/s);
  assert.match(css, /\.desktop-nav a\s*{[^}]*font-size:\s*var\(--header-font-size\);/s);
  assert.match(css, /\.about-hero\s*{[^}]*width:\s*100%;[^}]*gap:\s*clamp\(2rem,\s*4vw,\s*4rem\);[^}]*padding:[^;]*var\(--page-gutter\)/s);
  assert.match(css, /\.about-copy h1\s*{[^}]*font-size:\s*clamp\(2\.75rem,\s*5vw,\s*5rem\);/s);
  assert.match(css, /\.about-introduction\s*{[^}]*max-width:\s*none;/s);
  assert.match(css, /\.content-page\s*{[^}]*padding:[^;]*var\(--page-gutter\)[^}]*background:\s*var\(--paper\);/s);
  assert.match(css, /\.content-page-copy\s*{[^}]*width:\s*100%;/s);
  assert.match(css, /\.content-page h1\s*{[^}]*font-size:\s*clamp\(2\.75rem,\s*5vw,\s*5rem\);/s);
  assert.match(css, /@media\s*\(max-width:\s*720px\)[\s\S]*\.about-copy h1\s*{[^}]*font-size:\s*clamp\(2\.75rem,\s*13vw,\s*4rem\);/s);
  assert.match(css, /@media\s*\(max-width:\s*720px\)[\s\S]*\.content-page h1\s*{[^}]*font-size:\s*clamp\(2\.75rem,\s*13vw,\s*4rem\);/s);
  assert.match(css, /\.markdown-body ul\s*{[^}]*list-style:\s*none;/s);
  assert.match(css, /\.markdown-body ul > li::before\s*{[^}]*content:\s*"▶";/s);
  assert.match(css, /\.content-page-research \.markdown-body a\s*{[^}]*border-bottom-color:\s*transparent;/s);
  assert.match(css, /\.content-page-research \.markdown-body a:hover,[^}]*border-bottom-color:\s*currentColor;/s);
  assert.match(css, /\.content-page-teaching \.markdown-body h3 a\s*{[^}]*border-bottom-color:\s*transparent;/s);
  assert.match(css, /\.content-page-teaching \.markdown-body h3 a:hover,[^}]*border-bottom-color:\s*currentColor;/s);
  assert.match(css, /\.content-page-teaching \.markdown-body > h1\s*{[^}]*margin:\s*clamp\(4rem,\s*6vw,\s*5rem\)\s*0\s*2rem;/s);
  assert.match(css, /\.content-page-teaching \.markdown-body > h2\s*{[^}]*border-top:\s*0;/s);
  assert.match(css, /footer\s*{[^}]*padding:\s*1\.5rem var\(--page-gutter\);/s);

  await Promise.all([
    access(new URL("../public/profile.jpg", import.meta.url)),
    access(new URL("../public/cv.pdf", import.meta.url)),
    ...syllabusFiles.map((file) =>
      access(new URL(`../public/linkresource/${file}`, import.meta.url)),
    ),
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
