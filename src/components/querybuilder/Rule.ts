import type { Range } from "@/model/Search";
import type { LookupCompletionFunction } from "../AutocompleteInput.vue";

export type LeafRule = {
  completionPath?: string;
  min?: number;
  max?: number;
  group?: string;
  field: string;
  label: string;
  type: "text" | "number";
  ops: RuleOp[];
};

export type NestedRule = {
  group?: string;
  field: string;
  label: string;
  type: "nested";
  rules: Rule[];
};

export type Rule = NestedRule | LeafRule;

export type RuleOp = {
  label: string;
  description: string;
};

export type QueryBuilderOptions = {
  maxDepth: number;
  labels: {
    removeRule: string;
    removeGroup: string;
    resetGroup: string;
    matchType: string;
    matchTypes: {
      and: string;
      or: string;
    };
    addRule: string;
    addGroup: string;
    textInputPlaceholder: string;
  };
  defaultValue: (v: Rule, op: RuleOp) => number | string | Range;
  lookupFn: (v: Rule) => LookupCompletionFunction;
};

export function defaultOptions(
  opt?: Partial<QueryBuilderOptions>,
): QueryBuilderOptions {
  const def: QueryBuilderOptions = {
    maxDepth: 3,
    labels: {
      removeRule: "&times;",
      resetGroup: "&circlearrowleft;",
      removeGroup: "&times;",
      matchType: "Type",
      matchTypes: {
        or: "At least one must match",
        and: "All must match",
      },
      addRule: "Add field",
      addGroup: "Add group",
      textInputPlaceholder: "Enter search",
    },
    defaultValue(r: Rule, op: RuleOp) {
      if (r.type === "text") return "";
      if (r.type === "number") {
        const orZero = (n?: number) => (n == undefined ? 0 : n);

        if (op.label === "[]")
          return { from: orZero(r.min), to: orZero(r.max) };
        if (["<", "<="].some((o) => op.label === o)) return orZero(r.max);
        if ([">", ">="].some((o) => op.label === o)) return orZero(r.min);
        else return 0;
      }
      throw "No default value";
    },
    lookupFn() {
      return (p) => Promise.resolve([p]);
    },
  };
  if (opt) return { ...def, ...opt };
  return def;
}
