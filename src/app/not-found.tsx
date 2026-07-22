import Link from "next/link";
import { GlobalPageShell } from "@contentforge/theme-homerio/layouts/GlobalPageShell";
import { FooterShell } from "@contentforge/theme-homerio/shell/FooterShell";
import { HeaderShell } from "@contentforge/theme-homerio/shell/HeaderShell";
import { createFooterShellProps, createHeaderShellProps } from "@/theme/v3-page-adapter";

export default function NotFound() {
  return (
    <GlobalPageShell header={<HeaderShell {...createHeaderShellProps()} />} footer={<FooterShell {...createFooterShellProps()} />}>
      <div className="container" style={{ paddingTop: 80 }}>
        <div className="empty-state">
          <span className="eyebrow">404</span>
          <h1>Story Not Found</h1>
          <p>It may still be a draft, may have been unpublished, or the link may be incorrect.</p>
          <Link className="button" href="/">
            Back to Home
          </Link>
        </div>
      </div>
    </GlobalPageShell>
  );
}
