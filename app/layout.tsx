import type { Metadata } from "next";
import { getSiteDetails } from "../lib/content";
import { SiteFooter } from "./components/SiteFooter";
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
  const [site, chineseSite] = await Promise.all([getSiteDetails(), getSiteDetails("chn")]);

  return (
    <html lang="en">
      <body>
        <SiteHeader site={site} chineseSite={chineseSite} />
        <main>{children}</main>
        <SiteFooter site={site} chineseSite={chineseSite} />
      </body>
    </html>
  );
}
