export function calculatePaginationData(count, perPage, page) {
  const pages = Math.ceil(count / perPage);

  return {
    page,
    perPage,
    totalItems: count,
    totalPages: pages,
    hasNextPage: pages - page > 0,
    hasPreviousPage: page > 1,
  };
}
