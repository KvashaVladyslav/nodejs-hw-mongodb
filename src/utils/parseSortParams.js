import { SORT_ORDER } from '../constants/constants.js';

function parseSortBy(sortBy) {
  const keys = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
    'createdAt',
  ];

  if (keys.includes(sortBy)) {
    return sortBy;
  }

  return '_id';
}

function parseSortOrder(sortOrder) {
  if ([SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder)) {
    return sortOrder;
  }
  return SORT_ORDER.ASC;
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return { sortBy: parsedSortBy, sortOrder: parsedSortOrder };
}
