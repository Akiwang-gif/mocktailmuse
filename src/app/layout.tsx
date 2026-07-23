import type { Metadata } from "next";
import localFont from "next/font/local";
import "@contentforge/theme-homerio/styles/index.css";
import "./globals.css";
import { themeCssVariables } from "@/config/theme.config";
import { getSiteIdentitySettings } from "@/db/repositories/site-settings";
import { canonicalUrl, getSiteUrl } from "@/lib/seo";

const instrumentSerif = localFont({
  src: [
    {
      path: "../../public/fonts/mocktail-editorial/instrument-serif/InstrumentSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/mocktail-editorial/instrument-serif/InstrumentSerif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--mocktail-instrument-serif",
  display: "block",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteIdentitySettings();

  return {
    metadataBase: getSiteUrl(),
    title: {
      default: settings.defaultSeoTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.defaultSeoDescription,
    alternates: {
      canonical: canonicalUrl("/"),
    },
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
    },
    openGraph: {
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
      url: canonicalUrl("/"),
      siteName: settings.siteName,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <body style={themeCssVariables()}>{children}</body>
    </html>
  );
}
