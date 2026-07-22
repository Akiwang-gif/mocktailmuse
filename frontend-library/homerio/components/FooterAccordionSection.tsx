"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export type FooterLink = {
  label: string;
  href: string;
};

type FooterAccordionSectionProps = {
  title: string;
  links: ReadonlyArray<FooterLink>;
};

export function FooterAccordionSection({ title, links }: FooterAccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={`footer-column footer-accordion${isOpen ? " is-open" : ""}`}>
      <button className="footer-accordion-trigger" type="button" aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
        <span className="footer-column-title">{title}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      <div className="footer-links">
        {links.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
