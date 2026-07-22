import Link from "next/link";
import { Mail, Rss } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { listCategories } from "@/db/repositories/content";
import { getSiteIdentitySettings } from "@/db/repositories/site-settings";

export async function SiteFooter() {
  const [categories, identity] = await Promise.all([listCategories(), getSiteIdentitySettings()]);
  const footerActions = siteConfig.navigation.primary.filter((item) => item.href !== "/").slice(-2);
  const [primaryAction, secondaryAction] = footerActions;

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section className="footer-brand">
          <Link className="site-logo footer-logo" href="/">
            <span>{siteConfig.brand.logoPrefix}</span>
            {siteConfig.brand.logoSuffix}
          </Link>
          <p>{identity.siteDescription}</p>
          <div className="footer-actions">
            <Link className="button" href={primaryAction.href}>
              <Rss size={16} aria-hidden="true" />
              {primaryAction.label}
            </Link>
            <Link className="button button-secondary" href={secondaryAction.href}>
              <Mail size={16} aria-hidden="true" />
              {secondaryAction.label}
            </Link>
          </div>
        </section>
        <section className="footer-column">
          <div className="footer-column-title">Sections</div>
          <div className="footer-links">
            {categories.map((category) => (
              <Link href={`/category/${category.slug}`} key={category.slug}>
                {category.name}
              </Link>
            ))}
          </div>
        </section>
        <section className="footer-column">
          <div className="footer-column-title">Site</div>
          <div className="footer-links">
            {siteConfig.navigation.footerSite.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </section>
        <section className="footer-column">
          <div className="footer-column-title">Legal</div>
          <div className="footer-links">
            {siteConfig.navigation.legal.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
      <div className="footer-legal-bar">
        <div className="container footer-bottom">
          <span className="footer-copyright">
            Copyright © {siteConfig.brand.copyrightYear} {identity.siteName}. All Rights Reserved.
          </span>
          <span>Operated by {identity.operatorName}</span>
          <span>{identity.operatorCountry}</span>
          <span>Legal Status: {identity.legalStatus}</span>
        </div>
      </div>
    </footer>
  );
}
