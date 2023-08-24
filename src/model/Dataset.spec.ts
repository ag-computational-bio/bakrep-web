import { expect, it } from "vitest";
import { DatasetSchema } from "./Dataset";
it("should parse correct dataset", () => {
  const ds = {
    id: "SAMD00126413",
    results: [
      {
        md5: "5a107d8b8a799406c845cabece7d9d6d",
        size: 5489256,
        url: "https://bakrep-data.s3.computational.bio.uni-giessen.de/SAMD00126413/SAMD00126413.bakta.json.gz",
        attributes: { type: "annotation", filetype: "json", tool: "bakta" },
      },
    ],
  };
  DatasetSchema.parse(ds);
});
it("should fail with non dataset", () => {
  const ds = {};
  expect(() => DatasetSchema.parse(ds)).toThrowError();
});
