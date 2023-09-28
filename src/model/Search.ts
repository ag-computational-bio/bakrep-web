export type EmptyQuery = {};
export type NumberQuery = {
  field: string;
  op: "==" | "!=" | "<" | "<=" | ">" | ">=" | "[]";
  value: number;
};
export type Range = {
  from: number;
  to: number;
};

export type RangeQuery = {
  field: string;
  op: "[]";
  value: Range;
};
export type StringQuery = {
  field: string;
  op: "==" | "~";
  value: string;
};
export type CompoundQuery = {
  op: "or" | "and";
  value: Query[];
};
export type NotQuery = {
  op: "not";
  value: Query;
};
export type NestedQuery = {
  op: "nested";
  field: string;
  value: Query;
};

export type Query =
  | EmptyQuery
  | CompoundQuery
  | NotQuery
  | NumberQuery
  | StringQuery
  | NestedQuery
  | RangeQuery;

export type LeafQuery = NumberQuery | RangeQuery | StringQuery;

export function isLeafQuery(q: Query): q is LeafQuery {
  return (
    "value" in q && (isNumber(q.value) || isString(q.value) || isRange(q.value))
  );
}

export function isString(d: unknown): d is string {
  return typeof d === "string" || d instanceof String;
}

export function isNumber(d: unknown): d is number {
  return typeof d === "number" || d instanceof Number;
}

export function isRange(d: unknown): d is Range {
  return d != null && typeof d === "object" && "from" in d && "to" in d;
}

export type SortDirection = "asc" | "desc";

export type SortOption = {
  field: string;
  ord: SortDirection;
};

export type SearchRequest = OffsetSearchRequest | SearchAfterSearchRequest;

export type OffsetSearchRequest = {
  offset: number;
  limit: number;
  query: Query;
  sort: SortOption[];
};

export type SearchAfterSearchRequest = {
  search_after: SearchAfter;
  limit: number;
  query: Query;
  sort: SortOption[];
};

export type SearchAfter = (string | number | boolean | null)[];

export type SearchResult<T> = {
  offset?: number;
  search_after: SearchAfter;
  total: number;
  results: T[];
};

export type SearchInfoLeaf = {
  field: string;
  ops: string[];
  type: "text" | "number";
};
export type SearchInfoNested = {
  field: string;
  fields: SearchInfoField[];
  ops: string[];
  type: "nested";
};
export type SearchInfoField = SearchInfoLeaf | SearchInfoNested;

export type SearchInfo = {
  fields: SearchInfoField[];
};
