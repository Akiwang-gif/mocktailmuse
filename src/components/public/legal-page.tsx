import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";

export interface LegalSection {
  title: string;
  body?: readonly string[];
  items?: readonly string[];
}

function renderInlineText(text: string) {
  const pattern = /(https?:\/\/[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g;
  const parts = text.split(pattern);

  return parts.map((part) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a href={part} key={part} rel="noreferrer" target="_blank">
          {part}
        </a>
      );
    }

    if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(part)) {
      return (
        <a href={`mailto:${part}`} key={part}>
          {part}
        </a>
      );
    }

    return part;
  });
}

export function LegalPage({
  eyebrow,
  intro,
  sections,
  title,
}: {
  eyebrow: string;
  intro: string;
  sections: readonly LegalSection[];
  title: string;
}) {
  return (
    <main className="site-shell">
      <SiteHeader />
      <div className="container page-narrow legal-page-shell">
        <section className="panel newspaper-panel editorial-page legal-document">
          <header className="legal-document-header">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{intro}</p>
          </header>
          {sections.map((section) => (
            <section className="legal-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph}>{renderInlineText(paragraph)}</p>
              ))}
              {section.items ? (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{renderInlineText(item)}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
