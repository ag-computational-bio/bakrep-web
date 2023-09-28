import type { SearchAfter } from "./Search";

export type TsvSearchResult = {
  total: number;
  search_after: SearchAfter;
  // The header line
  header: string;
  // all other lines
  data: string;
};

export function tsvSearchResultFromText(t: string): TsvSearchResult {
  if (!t.startsWith("##")) throw "Can't process result";
  const searchDataEol = t.indexOf("\n");
  const searchData = JSON.parse(t.substring(2, searchDataEol));

  let dataStart = searchDataEol + 1;
  let header = undefined;
  if (t[searchDataEol + 1] === "#") {
    const headerEol = t.indexOf("\n", dataStart);
    header = t.substring(dataStart, headerEol + 1);
    dataStart = headerEol + 1;
  }
  const data = t.substring(dataStart);

  return { data: data, header: header, ...searchData };
}
