import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type HomeCategoryCardProps = {
  title: ReactNode;
  href: string;
  description?: ReactNode;
  image: {
    src: string;
    alt: string;
  };
  layout?: "portrait" | "landscape";
  icon?: ReactNode;
};

export function HomeCategoryCard({ title, href, description, image, layout = "portrait", icon }: HomeCategoryCardProps) {
  const cardIcon = icon ?? <ArrowUpRight size={18} aria-hidden="true" />;

  return (
    <Link className={`home-category-card home-category-card-${layout}`} href={href}>
      <span className="home-category-media">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes={layout === "portrait" ? "(max-width: 900px) 50vw, 25vw" : "(max-width: 900px) 50vw, 33vw"}
        />
      </span>
      <span className="home-category-copy">
        <span>
          <strong>{title}</strong>
          {description ? <em>{description}</em> : null}
        </span>
        {cardIcon}
      </span>
    </Link>
  );
}
