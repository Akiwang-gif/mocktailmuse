import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export type EditorialArticleCardProps = {
  title: ReactNode;
  href: string;
  titleLevel?: "h2" | "h3";
  excerpt?: ReactNode;
  image?: {
    src: string;
    alt: string;
  };
  category?: {
    label: string;
    href?: string;
  };
  date?: {
    label: string;
    dateTime?: string;
  };
  readingTime?: string;
  author?: ReactNode;
  variant?: "standard" | "feature" | "compact";
};

export function EditorialArticleCard({
  title,
  href,
  titleLevel = "h2",
  excerpt,
  image,
  category,
  date,
  readingTime,
  author,
  variant = "standard",
}: EditorialArticleCardProps) {
  const TitleTag = titleLevel;

  return (
    <article className={`editorial-article-card editorial-article-card-${variant}`}>
      {image ? (
        <Link className="editorial-article-image" href={href} aria-label={plainTextLabel(title)}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            unoptimized
            sizes={variant === "feature" ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 900px) 100vw, 34vw"}
          />
        </Link>
      ) : null}
      <div className="editorial-article-copy">
        {category || date || readingTime ? (
          <div className="article-kicker">
            {category ? category.href ? <Link href={category.href}>{category.label}</Link> : <span>{category.label}</span> : null}
            {date ? <time dateTime={date.dateTime}>{date.label}</time> : null}
            {readingTime ? <span>{readingTime}</span> : null}
          </div>
        ) : null}
        <Link href={href}>
          <TitleTag>{title}</TitleTag>
        </Link>
        {author ? <div className="article-byline">{author}</div> : null}
        {excerpt ? <p>{excerpt}</p> : null}
      </div>
    </article>
  );
}

function plainTextLabel(value: ReactNode) {
  return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
}
