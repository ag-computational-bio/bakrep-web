export type EmptyQuery = {};
export type NumberQuery = {
  field: string;
  op: "==" | "!=" | "<" | "<=" | ">" | ">=" | "[]";
  value: number;
};
export type RangeQuery = {
  field: string;
  op: "[]";
  value: {
    from: number;
    to: number;
  };
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

export type SortOption = {
  field: string;
  ord: "asc" | "desc";
};

export type SearchRequest = {
  offset: number;
  limit: number;
  query: Query;
  sort: SortOption[];
};

export type SearchResult<T> = {
  offset: number;
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
