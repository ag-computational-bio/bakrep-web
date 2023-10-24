/**
 * Sorts according to a order lookup table.
 * @param order An assignment of key to position
 * @param extract The field to sort on.
 * @returns
 */
export default function sortByOrder<T>(
  order: Record<string, number>,
  extract: (t: T) => string,
): (a: T, b: T) => number {
  return (a, b) => {
    const av = order[extract(a)];
    const bv = order[extract(b)];

    if (av && bv) return av - bv;
    else if (av) return 1;
    else if (bv) return -1;
    return -1;
  };
}

export function sortByString<T>(
  extract: (t: T) => string,
  ignoreCase = true,
): (a: T, b: T) => number {
  return (a, b) => {
    const av = ignoreCase ? extract(a).toLowerCase() : extract(a);
    const bv = ignoreCase ? extract(b).toLowerCase() : extract(b);
    if (av < bv) return -1;
    else if (av > bv) return 1;
    else return 0;
  };
}
