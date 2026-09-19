export type PaginationPageItem = { kind: "page"; page: number } | { kind: "ellipsis"; key: string };

export function getPaginationItems(
  page: number,
  pageCount: number,
  siblingCount: number,
): PaginationPageItem[] {
  const total = Math.max(1, Math.floor(pageCount));
  const current = Math.min(Math.max(1, Math.floor(page)), total);
  const siblings = Math.max(0, Math.floor(siblingCount));
  if (total <= 7) {
    const all: PaginationPageItem[] = [];
    for (let p = 1; p <= total; p += 1) {
      all.push({ kind: "page", page: p });
    }
    return all;
  }
  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);
  const items: PaginationPageItem[] = [{ kind: "page", page: 1 }];
  if (start > 2) {
    items.push({ kind: "ellipsis", key: "start" });
  } else {
    for (let p = 2; p < start; p += 1) {
      items.push({ kind: "page", page: p });
    }
  }
  for (let p = start; p <= end; p += 1) {
    items.push({ kind: "page", page: p });
  }
  if (end < total - 1) {
    items.push({ kind: "ellipsis", key: "end" });
  } else {
    for (let p = end + 1; p < total; p += 1) {
      items.push({ kind: "page", page: p });
    }
  }
  items.push({ kind: "page", page: total });
  return items;
}

