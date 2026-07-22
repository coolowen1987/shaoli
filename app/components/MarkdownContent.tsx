import type { MarkdownPage } from "../../lib/content";

function EmptyPageLines() {
  return (
    <div className="empty-page" aria-label="Content to be added">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

export function MarkdownContent({ page }: { page: MarkdownPage }) {
  if (page.isEmpty) return <EmptyPageLines />;

  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: page.html }} />;
}
