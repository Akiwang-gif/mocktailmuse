import type React from "react";
import { Search } from "lucide-react";

export type SearchPanelShellProps = {
  action: string;
  query?: string;
  placeholder?: React.ReactNode;
  buttonLabel?: React.ReactNode;
};

export function SearchPanelShell({
  action,
  query = "",
  placeholder = "Search",
  buttonLabel = "Search",
}: SearchPanelShellProps) {
  return (
    <form action={action} className="search-panel">
      <Search color="var(--homerio-muted)" size={20} aria-hidden="true" />
      <input name="q" defaultValue={query} placeholder={plainTextPlaceholder(placeholder)} />
      <button className="button" type="submit">
        <Search size={17} aria-hidden="true" />
        {buttonLabel}
      </button>
    </form>
  );
}

function plainTextPlaceholder(value: React.ReactNode) {
  return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
}
