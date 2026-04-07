/**
 * Normalize Lighthouse @paginate responses ({ data, paginatorInfo }) vs plain arrays.
 */
export function unwrapPaginated(field) {
  if (field == null) {
    return { items: [], paginatorInfo: null };
  }
  if (Array.isArray(field)) {
    return { items: field, paginatorInfo: null };
  }
  if (Array.isArray(field.data)) {
    return {
      items: field.data,
      paginatorInfo: field.paginatorInfo ?? null,
    };
  }
  return { items: [], paginatorInfo: field.paginatorInfo ?? null };
}

/** Total count for paginated lists, or list length when no paginator. */
export function paginatedTotal(field) {
  const { items, paginatorInfo } = unwrapPaginated(field);
  if (paginatorInfo != null && typeof paginatorInfo.total === 'number') {
    return paginatorInfo.total;
  }
  return items.length;
}
