"use client";

import { cn } from "@geiger/ui";
import { DEFAULT_PAGE_SIZE, ListPagination, usePagination } from "@/components/list-pagination";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

// Payment history table, paged client-side; rows arrive pre-formatted from the billing page.
export function PaymentHistory({ rows }) {
  const { pageItems, ...pagination } = usePagination(rows, { pageSize: DEFAULT_PAGE_SIZE });

  if (!rows.length) {
    return <p className="text-sm text-muted-foreground">No payments yet. Receipts appear here after checkout.</p>;
  }

  return (
    <>
      <div className="-mx-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-1 pb-2 font-medium">Date</th>
              <th className="px-1 pb-2 font-medium">Description</th>
              <th className="px-1 pb-2 text-right font-medium">Amount</th>
              <th className="px-1 pb-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border border-t border-border">
            {pageItems.map((row) => (
              <tr key={row.id} className="align-top">
                <td className="whitespace-nowrap px-1 py-3 text-muted-foreground">{row.date}</td>
                <td className="max-w-0 px-1 py-3 sm:w-1/2">
                  <span className="font-medium">{row.plan}</span>
                  <span className="text-muted-foreground"> · {row.interval}ly</span>
                  {row.products.length ? (
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {row.products.length} {row.products.length === 1 ? "product" : "products"}:{" "}
                      {row.products.join(", ")}
                    </span>
                  ) : null}
                </td>
                <td className="whitespace-nowrap px-1 py-3 text-right font-medium tabular-nums">{row.amount}</td>
                <td
                  className={cn(
                    "whitespace-nowrap px-1 py-3 text-right",
                    row.statusMuted ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {row.statusLabel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Only worth a footer once there is more than the smallest page of payments. */}
      {rows.length > PAGE_SIZE_OPTIONS[0] ? (
        <ListPagination
          {...pagination}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          itemLabel="payments"
          className="mt-4 border-t border-border pt-4"
        />
      ) : null}
    </>
  );
}

export default PaymentHistory;
