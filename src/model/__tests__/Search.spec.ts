import { describe, expect, it } from "vitest";
import { isNumber, isRange } from "../Search";

describe("isNumber", () => {
  it("number", () => expect(isNumber(1)).toBe(true));
  it("string", () => expect(isNumber("2")).toBe(false));
  it("undefined", () => expect(isNumber(undefined)).toBe(false));
  it("null", () => expect(isNumber(null)).toBe(false));
  it("object", () => expect(isNumber({})).toBe(false));
});
describe("isRange", () => {
  it("number", () => expect(isRange(1)).toBe(false));
  it("string", () => expect(isRange("2")).toBe(false));
  it("undefined", () => expect(isRange(undefined)).toBe(false));
  it("null", () => expect(isRange(null)).toBe(false));
  it("object", () => expect(isRange({})).toBe(false));
  it("range object", () => expect(isRange({ from: 1, to: 4 })).toBe(true));
});
