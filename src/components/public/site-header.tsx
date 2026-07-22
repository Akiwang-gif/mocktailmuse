import Link from "next/link";
import { Menu, Search, Settings } from "lucide-react";
import { siteConfig } from "@/config/site.config";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="masthead">
        <Link className="site-logo" href="/">
          <span>{siteConfig.brand.logoPrefix}</span>
          {siteConfig.brand.logoSuffix}
        </Link>
      </div>
      <div className="nav-bar">
        <button className="icon-button" aria-label="Open menu" type="button">
          <Menu size={22} aria-hidden="true" />
        </button>
        <nav className="nav-links" aria-label="Primary navigation">
          {siteConfig.navigation.primary.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-tools" aria-label="Site tools">
          <Settings size={17} aria-hidden="true" />
          <Link href="/search" aria-label="Search">
            <Search size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SearchPanel({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" className="search-panel">
      <Search color="var(--muted)" size={20} aria-hidden="true" />
      <input
        name="q"
        defaultValue={defaultValue}
        placeholder={siteConfig.content.searchPlaceholder}
      />
      <button className="button" type="submit">
        <Search size={17} aria-hidden="true" />
        Search
      </button>
    </form>
  );
}
