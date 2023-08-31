import { describe, expect, it } from "vitest";
import { currentPage, pages, type PaginationData } from "./Pagination";

function p(offset: number, limit: number, total: number): PaginationData {
  return { offset: offset, limit: limit, total: total };
}
describe("currentPage", () => {
  it("should work for no results", () => {
    expect(currentPage(p(0, 20, 0))).toBeNaN();
    expect(currentPage(p(20, 20, 0))).toBeNaN();
  });
  it("should give no result when offset larger than total", () => {
    expect(currentPage(p(20, 20, 10))).toBeNaN();
  });
  it("should work for results", () => {
    expect(currentPage(p(0, 20, 40))).toBe(1);
    expect(currentPage(p(20, 20, 40))).toBe(2);
    expect(currentPage(p(40, 20, 40))).toBe(3);
  });
});
describe("pages", () => {
  it("should work for no results", () => {
    expect(pages(p(0, 20, 0))).toEqual([]);
    expect(pages(p(20, 20, 0))).toEqual([]);
  });
  it("should work for results", () => {
    expect(pages(p(0, 2, 10))).toEqual([1, 2, 3]);
    expect(pages(p(6, 2, 10))).toEqual([2, 3, 4, 5]);
    expect(pages(p(8, 2, 10))).toEqual([3, 4, 5]);
    expect(pages(p(8, 2, 11))).toEqual([3, 4, 5, 6]);
    expect(pages(p(20, 2, 11))).toEqual([1, 2, 3]);
    expect(pages(p(1, 2, 11))).toEqual([1, 2, 3]);
  });
});
