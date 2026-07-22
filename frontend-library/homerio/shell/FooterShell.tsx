import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { FooterAccordionSection, type FooterLink } from "../components/FooterAccordionSection";
import type { ThemeImage, ThemeLink } from "../media/media-types";

type FooterLogo = {
  prefix?: React.ReactNode;
  suffix: React.ReactNode;
  href?: string;
};

export type FooterShellProps = {
  logo: FooterLogo;
  description?: React.ReactNode;
  contactLink?: ThemeLink & {
    icon?: React.ReactNode;
  };
  categoryLinks: ReadonlyArray<FooterLink>;
  companyLinks: ReadonlyArray<FooterLink>;
  legalLinks: ReadonlyArray<FooterLink>;
  footerImage?: ThemeImage;
  copyright: React.ReactNode;
  legalIdentity?: readonly React.ReactNode[];
};

export function FooterShell({
  logo,
  description,
  contactLink,
  categoryLinks,
  companyLinks,
  legalLinks,
  footerImage,
  copyright,
  legalIdentity = [],
}: FooterShellProps) {
  const logoHref = logo.href ?? "/";

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section className="footer-brand">
          <Link className="site-logo footer-logo" href={logoHref}>
            {logo.prefix ? <span>{logo.prefix}</span> : null}
            {logo.suffix}
          </Link>
          {description ? <p>{description}</p> : null}
          {contactLink ? (
            <Link className="footer-contact-link" href={contactLink.href}>
              {contactLink.icon ?? <Mail size={15} aria-hidden="true" />}
              {contactLink.label}
            </Link>
          ) : null}
        </section>

        <FooterAccordionSection title="Explore" links={categoryLinks} />
        <FooterAccordionSection title="Company" links={companyLinks} />
        <FooterAccordionSection title="Legal" links={legalLinks} />

        {footerImage ? (
          <div className="footer-still-life" aria-hidden="true">
            <Image src={footerImage.src} alt="" fill priority sizes="(max-width: 900px) 100vw, 260px" />
          </div>
        ) : null}
      </div>

      <div className="footer-legal-bar">
        <div className="container footer-bottom">
          <span className="footer-copyright">{copyright}</span>
          {legalIdentity.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
