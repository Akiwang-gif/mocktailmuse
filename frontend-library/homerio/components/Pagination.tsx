import Link from "next/link";

type PaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  previousLabel?: string;
  nextLabel?: string;
  getPageHref?: (page: number) => string;
  pageParamName?: string;
};

type PaginationSummaryProps = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  itemLabel?: string;
  itemLabelPlural?: string;
};

export function itemCountLabel(count: number, itemLabel = "item", itemLabelPlural = "items") {
  return `${count} ${count === 1 ? itemLabel : itemLabelPlural}`;
}

function pageHref(basePath: string, page: number, pageParamName = "page") {
  return page <= 1 ? basePath : `${basePath}?${pageParamName}=${page}`;
}

function visiblePages(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return [...pages].filter((page) => page >= 1 && page <= totalPages).toSorted((a, b) => a - b);
}

export function Pagination({
  basePath,
  currentPage,
  totalPages,
  previousLabel = "Previous",
  nextLabel = "Next",
  getPageHref,
  pageParamName = "page",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = visiblePages(currentPage, totalPages);
  const hrefForPage = getPageHref ?? ((page: number) => pageHref(basePath, page, pageParamName));
  let previousPage = 0;

  return (
    <nav className="pagination" aria-label="Pagination">
      {currentPage > 1 ? <Link href={hrefForPage(currentPage - 1)}>{previousLabel}</Link> : null}
      {pages.map((page) => {
        const needsEllipsis = previousPage > 0 && page - previousPage > 1;
        previousPage = page;

        return (
          <span className="pagination-group" key={page}>
            {needsEllipsis ? <span className="pagination-ellipsis">...</span> : null}
            {page === currentPage ? (
              <span className="pagination-current" aria-current="page">
                {page}
              </span>
            ) : (
              <Link href={hrefForPage(page)}>{page}</Link>
            )}
          </span>
        );
      })}
      {currentPage < totalPages ? <Link href={hrefForPage(currentPage + 1)}>{nextLabel}</Link> : null}
    </nav>
  );
}

export function PaginationSummary({
  currentPage,
  pageSize,
  totalItems,
  itemLabel = "item",
  itemLabelPlural = "items",
}: PaginationSummaryProps) {
  if (totalItems === 0) {
    return <p className="pagination-summary">Showing 0 of 0 {itemLabelPlural}</p>;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <p className="pagination-summary">
      Showing {start}&ndash;{end} of {itemCountLabel(totalItems, itemLabel, itemLabelPlural)}
    </p>
  );
}
