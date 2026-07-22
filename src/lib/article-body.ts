export function normalizeArticleBodyHtml(html: string): string {
  if (!html) return html;

  return html
    .replace(/<\s*h1\b([^>]*)>/gi, "<h2$1>")
    .replace(/<\s*\/\s*h1\s*>/gi, "</h2>");
}
