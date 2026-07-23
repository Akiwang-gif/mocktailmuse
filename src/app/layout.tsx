import type { Metadata } from "next";
import localFont from "next/font/local";
import "@contentforge/theme-homerio/styles/index.css";
import "./globals.css";
import { themeCssVariables } from "@/config/theme.config";
import { getSiteIdentitySettings } from "@/db/repositories/site-settings";
import { canonicalUrl, getSiteUrl } from "@/lib/seo";

const productionOverrideCss = `
body .featured-articles-section .editorial-article-card-feature .editorial-article-image{position:relative;overflow:hidden}
body .featured-articles-section .editorial-article-card-feature .editorial-article-image>span,body .featured-articles-section .editorial-article-card-feature .editorial-article-image img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-height:none!important;object-fit:cover!important;object-position:center!important;border-radius:0!important}
body .category-results .article-list{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:clamp(32px,4vw,54px)!important}
body .category-results .editorial-article-card{display:grid!important;grid-template-columns:1fr!important;gap:clamp(18px,2vw,26px)!important;overflow:visible!important;color:#0d2747!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0!important;transform:none!important;transition:none!important}
body .category-results .editorial-article-card:hover,body .category-results .editorial-article-card:focus-within{border-color:transparent!important;box-shadow:none!important;transform:none!important}
body .category-results .editorial-article-image{position:relative!important;width:100%!important;height:auto!important;min-height:0!important;overflow:hidden!important;aspect-ratio:4/5!important;background:#dce5ef!important;border-radius:clamp(22px,2.4vw,34px)!important}
body .category-results .editorial-article-image>span,body .category-results .editorial-article-image img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-height:none!important;aspect-ratio:auto!important;object-fit:cover!important;object-position:center!important;border-radius:0!important}
body .category-results .editorial-article-copy{display:grid!important;gap:10px!important;min-height:0!important;min-width:0!important;padding:0!important}
body .category-results .article-kicker{order:1!important;gap:8px!important;color:#5d718a!important;font-size:.68rem!important;font-weight:650!important;line-height:1.45!important;letter-spacing:.11em!important;text-transform:uppercase!important}
body .category-results .article-kicker a{color:#0d2747!important}
body .category-results .editorial-article-copy>a{order:2!important;color:inherit!important;overflow:hidden!important}
body .category-results .editorial-article-card .editorial-article-copy h2,body .category-results .editorial-article-card .editorial-article-copy h3,body .category-results .editorial-article-card-standard .editorial-article-copy h2,body .category-results .editorial-article-card-standard .editorial-article-copy h3{display:block!important;max-width:100%!important;color:#0d2747!important;font-family:var(--mocktail-display)!important;overflow:hidden!important;font-size:clamp(.9rem,1.04vw,1.24rem)!important;font-style:italic!important;font-weight:300!important;line-height:1.08!important;letter-spacing:-.02em!important;text-overflow:ellipsis!important;text-wrap:normal!important;white-space:nowrap!important}
body .category-results .article-byline,body .category-results .editorial-article-copy p{display:none!important}
@media (max-width:768px){
body .home-hero>.site-header{position:absolute!important;top:12px!important;right:14px!important;left:14px!important;width:auto!important;min-height:0!important;margin:0!important;overflow:visible!important;border-radius:28px!important}
body .home-hero>.site-header .masthead,body .site-header .masthead{display:grid!important;grid-template-columns:42px minmax(0,1fr) 42px!important;align-items:center!important;min-height:56px!important;height:56px!important;padding:0 8px!important}
body .home-hero>.site-header .nav-bar,body .home-hero>.site-header .nav-links,body .home-hero>.site-header .nav-tools,body .site-header .nav-bar,body .site-header .nav-links,body .site-header .nav-tools{display:none!important}
body .site-header .site-logo{grid-column:2!important;justify-self:center!important;max-width:100%!important;font-size:clamp(1.35rem,6vw,1.72rem)!important;line-height:1!important;white-space:nowrap!important;overflow:visible!important}
body .mobile-menu-panel .site-logo.mobile-menu-logo{grid-column:1!important;justify-self:start!important;width:auto!important;max-width:calc(100vw - 96px)!important;min-width:0!important;overflow:visible!important;font-size:clamp(1.05rem,4.8vw,1.28rem)!important;line-height:1!important;text-align:left!important;white-space:nowrap!important}
body .mobile-menu-panel .mobile-menu-head{display:grid!important;grid-template-columns:minmax(0,1fr) 36px!important;align-items:center!important;gap:10px!important}
body .mobile-menu-trigger,body .mobile-search{display:inline-flex!important;width:38px!important;min-width:38px!important;min-height:38px!important;padding:0!important}
body .category-showcase .home-category-grid,body .home-category-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;margin-top:16px!important}
body .category-showcase .home-category-card,body .home-category-card,body .category-showcase .home-category-card:nth-child(n+5),body .category-showcase .home-category-card.home-category-card-landscape{min-height:0!important;aspect-ratio:1/1.16!important;overflow:hidden!important;border-radius:16px!important}
body .category-showcase .home-category-media,body .category-showcase .home-category-card-landscape .home-category-media,body .home-category-media{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;aspect-ratio:auto!important}
body .category-showcase .home-category-media img,body .home-category-media img{width:100%!important;height:100%!important;object-fit:cover!important}
body .category-showcase .home-category-copy,body .category-showcase .home-category-content,body .home-category-copy{top:0!important;right:0!important;bottom:auto!important;left:0!important;padding:10px!important}
body .category-showcase .home-category-copy strong,body .category-showcase .home-category-content strong,body .home-category-copy strong{max-width:100%!important;overflow:hidden!important;color:#0d2747!important;font-size:clamp(.92rem,4.5vw,1.12rem)!important;line-height:1.05!important;letter-spacing:0!important;text-overflow:ellipsis!important}
body .featured-articles-section .editorial-article-card-feature .editorial-article-image{display:block!important;width:100%!important;min-height:0!important;aspect-ratio:4/3!important;background:transparent!important}
body .category-results .article-list{display:grid!important;grid-template-columns:1fr!important;gap:14px!important}
body .category-results .editorial-article-card{display:grid!important;grid-template-columns:112px minmax(0,1fr)!important;align-items:center!important;gap:12px!important;min-height:0!important;padding:10px!important;overflow:hidden!important;background:rgba(255,255,255,.82)!important;border:1px solid rgba(13,39,71,.1)!important;border-radius:18px!important;box-shadow:0 10px 24px rgba(13,39,71,.08)!important}
body .category-results .editorial-article-image{position:relative!important;width:112px!important;height:auto!important;min-height:0!important;aspect-ratio:4/5!important;overflow:hidden!important;background:#dce5ef!important;border-radius:14px!important}
body .category-results .editorial-article-image>span,body .category-results .editorial-article-image img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-height:none!important;aspect-ratio:auto!important;object-fit:cover!important;border-radius:0!important}
body .category-results .editorial-article-copy{display:grid!important;gap:7px!important;min-width:0!important;padding:0!important}
body .category-results .article-kicker{gap:6px!important;font-size:.58rem!important;line-height:1.25!important;letter-spacing:.09em!important}
body .category-results .editorial-article-card .editorial-article-copy h2,body .category-results .editorial-article-card .editorial-article-copy h3{display:-webkit-box!important;max-width:100%!important;overflow:hidden!important;font-size:clamp(1.02rem,5vw,1.3rem)!important;line-height:1.02!important;text-overflow:clip!important;white-space:normal!important;-webkit-line-clamp:3!important;-webkit-box-orient:vertical!important}
body .category-results .article-byline,body .category-results .editorial-article-copy p{display:none!important}
}
`;

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
      <body style={themeCssVariables()}>
        {children}
        <style
          id="mocktail-production-overrides"
          dangerouslySetInnerHTML={{ __html: productionOverrideCss }}
        />
      </body>
    </html>
  );
}
