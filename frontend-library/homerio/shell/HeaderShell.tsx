"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import type { ThemeLink } from "../media/media-types";

type HeaderLogo = {
  prefix?: React.ReactNode;
  suffix: React.ReactNode;
  href?: string;
};

export type HeaderShellProps = {
  logo: HeaderLogo;
  primaryNavigation: readonly ThemeLink[];
  moreNavigation?: readonly ThemeLink[];
  utilityLinks?: readonly ThemeLink[];
  searchHref?: string;
  searchLabel?: React.ReactNode;
  menuOpenLabel?: string;
  menuCloseLabel?: string;
};

export function HeaderShell({
  logo,
  primaryNavigation,
  moreNavigation = [],
  utilityLinks = [],
  searchHref = "/search",
  searchLabel = "Search",
  menuOpenLabel = "Open menu",
  menuCloseLabel = "Close menu",
}: HeaderShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoHref = logo.href ?? "/";

  return (
    <header className="site-header">
      <div className="masthead" id="site-top">
        <button
          className="mobile-menu-trigger"
          type="button"
          aria-label={mobileMenuOpen ? menuCloseLabel : menuOpenLabel}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu-panel"
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <div className={`mobile-menu-shell${mobileMenuOpen ? " is-open" : ""}`} hidden={!mobileMenuOpen}>
          <button className="mobile-menu-backdrop" type="button" aria-label={menuCloseLabel} onClick={() => setMobileMenuOpen(false)} />
          <nav className="mobile-menu-panel" id="mobile-menu-panel" aria-label="Mobile navigation">
            <div className="mobile-menu-head">
              <Link className="site-logo mobile-menu-logo" href={logoHref} onClick={() => setMobileMenuOpen(false)}>
                {logo.prefix ? <span>{logo.prefix}</span> : null}
                {logo.suffix}
              </Link>
              <button className="mobile-menu-close" type="button" onClick={() => setMobileMenuOpen(false)}>
                {menuCloseLabel}
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="mobile-menu-links">
              {primaryNavigation.map((item) => (
                <Link href={item.href} key={item.href} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mobile-menu-utility">
              <Link href={searchHref} onClick={() => setMobileMenuOpen(false)}>
                <Search size={15} aria-hidden="true" />
                {searchLabel}
              </Link>
              {utilityLinks.map((item) => (
                <Link href={item.href} key={item.href} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
        <Link className="site-logo" href={logoHref}>
          {logo.prefix ? <span>{logo.prefix}</span> : null}
          {logo.suffix}
        </Link>
        <Link className="mobile-search" href={searchHref} aria-label={String(searchLabel)}>
          <Search size={21} aria-hidden="true" />
        </Link>
      </div>
      <div className="nav-bar">
        <span aria-hidden="true" />
        <nav className="nav-links" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          {moreNavigation.length > 0 ? (
            <details className="nav-more">
              <summary>
                More <ChevronDown size={14} aria-hidden="true" />
              </summary>
              <div className="nav-more-menu">
                {moreNavigation.map((item) => (
                  <Link href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          ) : null}
        </nav>
        <div className="nav-tools" aria-label="Site tools">
          <Link href={searchHref} aria-label={String(searchLabel)}>
            <Search size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
