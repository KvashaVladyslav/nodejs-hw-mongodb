function parseIsFavourite(isFavourite) {
  if (typeof isFavourite !== 'string') {
    return undefined;
  }
  const isIsFavourite = (isFavourite) =>
    ['true', 'false'].includes(isFavourite);

  if (isIsFavourite(isFavourite)) {
    return isFavourite;
  }
}

function parseContactType(contactType) {
  if (typeof contactType !== 'string') {
    return undefined;
  }
  const isContactType = (contactType) =>
    ['personal', 'work', 'home'].includes(contactType);

  if (isContactType(contactType)) {
    return contactType;
  }
}

export function parseFilterParams(query) {
  const { isFavourite, contactType } = query;

  const parsedIsFavourite = parseIsFavourite(isFavourite);
  const parsedContactType = parseContactType(contactType);

  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedContactType,
  };
}
