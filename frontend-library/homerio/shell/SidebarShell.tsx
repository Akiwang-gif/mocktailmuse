import type React from "react";
import Link from "next/link";
import type { ThemeLink } from "../media/media-types";

export type SidebarShellProps = {
  tags: readonly ThemeLink[];
  editorPicks: readonly {
    title: React.ReactNode;
    href: string;
    meta?: React.ReactNode;
  }[];
  labels: {
    popularTags: React.ReactNode;
    editorPicks: React.ReactNode;
  };
};

export function SidebarShell({ tags, editorPicks, labels }: SidebarShellProps) {
  return (
    <aside className="sidebar">
      <section className="panel newspaper-panel">
        <div className="section-title" style={{ marginTop: 0 }}>
          <p className="section-heading-label">{labels.popularTags}</p>
        </div>
        <div className="tag-row">
          {tags.map((tag) => (
            <Link className="tag" href={tag.href} key={tag.href}>
              {tag.label}
            </Link>
          ))}
        </div>
      </section>
      <section className="panel newspaper-panel" style={{ marginTop: 14 }}>
        <div className="section-title" style={{ marginTop: 0 }}>
          <p className="section-heading-label">{labels.editorPicks}</p>
        </div>
        <ol className="heat-list">
          {editorPicks.map((article, index) => (
            <li key={article.href}>
              <span className="rank">{index + 1}</span>
              <div>
                <Link href={article.href}>{article.title}</Link>
                {article.meta ? <span>{article.meta}</span> : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
