import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type HomeSectionHeadingProps = {
  title: ReactNode;
  deck?: ReactNode;
  href?: string;
  linkLabel?: ReactNode;
  icon?: ReactNode;
};

export function HomeSectionHeading({ title, deck, href, linkLabel = "View all", icon }: HomeSectionHeadingProps) {
  const linkIcon = icon ?? <ChevronRight size={16} aria-hidden="true" />;

  return (
    <div className="home-section-heading">
      <div>
        <p>{title}</p>
        {deck ? <span>{deck}</span> : null}
      </div>
      {href ? (
        <Link href={href}>
          {linkLabel}
          {linkIcon}
        </Link>
      ) : null}
    </div>
  );
}
