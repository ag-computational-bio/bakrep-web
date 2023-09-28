import { expect, it } from "vitest";
import { tsvSearchResultFromText } from "../TsvSearchResult";

it("empty result should work", () =>
  expect(() => tsvSearchResultFromText("")).toThrowError(
    "Can't process result",
  ));
it("search_after result should work", () =>
  expect(
    tsvSearchResultFromText(
      `##{"total":2,"search_after":[12]}
#id\tvalue
x\t12
`,
    ),
  ).toStrictEqual({
    total: 2,
    search_after: [12],
    data: "x\t12\n",
    header: "#id\tvalue\n",
  }));
it("offset result should work", () =>
  expect(
    tsvSearchResultFromText(
      `##{"total":2,"search_after":[12],"offset":0}
#id\tvalue
x\t12
`,
    ),
  ).toStrictEqual({
    total: 2,
    offset: 0,
    search_after: [12],
    data: "x\t12\n",
    header: "#id\tvalue\n",
  }));
