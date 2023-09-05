import type { Range } from "@/model/Search";

export type LeafRule = {
  field: string;
  label: string;
  type: "text" | "number";
  ops: RuleOp[];
};

export type NestedRule = {
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
};
