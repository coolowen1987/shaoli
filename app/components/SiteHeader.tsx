import Link from "next/link";
import type { SiteDetails } from "../../lib/content";

const navigation = [
  ["About", "/"],
  ["Book", "/book/"],
  ["Papers", "/papers/"],
  ["Data", "/data/"],
  ["Teaching", "/teaching/"],
  ["CV", "/cv/"],
  ["Contact", "/contact/"],
] as const;

function Wordmark({ name }: { name: string }) {
  return name ? <>{name}</> : <span className="blank blank-wordmark" aria-hidden="true" />;
}

export function SiteHeader({ site }: { site: SiteDetails }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Home">
        <Wordmark name={site.name} />
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map(([label, href]) => (
          <Link href={href} key={href}>{label}</Link>
        ))}
      </nav>

      <details className="mobile-nav">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          {navigation.map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
