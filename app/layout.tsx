import type { Metadata } from "next";
import { getSiteDetails } from "../lib/content";
import { SiteHeader } from "./components/SiteHeader";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteDetails();

  return {
    title: {
      default: site.name || "Academic Portfolio",
      template: `%s · ${site.name || "Academic Portfolio"}`,
    },
    description: "A personal academic website for research, publications, teaching, and contact information.",
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteDetails();

  return (
    <html lang="en">
      <body>
        <SiteHeader site={site} />
        <main>{children}</main>
        <footer>
          <span>{site.name || <span className="blank blank-footer" aria-hidden="true" />}</span>
          <span>Academic portfolio · GitHub Pages</span>
          <LinkBackToTop />
        </footer>
      </body>
    </html>
  );
}

function LinkBackToTop() {
  return <a href="#top">Back to top ↑</a>;
}
