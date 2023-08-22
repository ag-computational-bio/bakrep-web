import { BaktaResultSchema, type BaktaResult } from "./model/BaktaResults";
import { DatasetSchema, type Dataset } from "./model/Dataset";
import { GtdbtkResultSchema, type GtdbtkResult } from "./model/GtdbtkResult";

let baseurl: string = "http://localhost:8080";
function initApi(url: string) {
  baseurl = url;
}

interface BakrepApi {
  getDataset(id: string): Promise<Dataset>;
  fetchUrlContentAsJson(url: string): Promise<any>;
  fetchBaktaResult(dataset: Dataset): Promise<BaktaResult>;
  fetchGtdbtkResult(dataset: Dataset): Promise<GtdbtkResult>;
}

class BakrepApiImpl implements BakrepApi {
  baseurl: string;
  constructor(baseurl: string) {
    this.baseurl = baseurl;
  }

  toJson(r: Response): Promise<any> {
    if (!r.ok) throw r.text().then((t) => Promise.reject(t));
    return r.json();
  }

  getDataset(id: string): Promise<Dataset> {
    return fetch(baseurl + "/datasets/" + id)
      .then(this.toJson)
      .then((j) => DatasetSchema.parse(j));
  }
  fetchUrlContentAsJson(url: string): Promise<any> {
    return fetch(url).then(this.toJson);
  }
  fetchBaktaResult(dataset: Dataset): Promise<BaktaResult> {
    const bakta = dataset.results.filter(
      (x) => x.attributes.tool === "bakta" && x.attributes.filetype === "json"
    );
    if (bakta.length == 0) {
      return Promise.reject(
        `Unsupported: Dataset does not contain bakta result: ${dataset}`
      );
    }
    if (bakta.length > 1)
      return Promise.reject(
        `Unsupported: Dataset constains multiple bakta results: ${dataset}`
      );
    return fetch(bakta[0].url).then(this.toJson).then(BaktaResultSchema.parse);
  }
  fetchGtdbtkResult(dataset: Dataset): Promise<GtdbtkResult> {
    const bakta = dataset.results.filter(
      (x) => x.attributes.tool === "gtdbtk" && x.attributes.filetype === "json"
    );
    if (bakta.length == 0) {
      return Promise.reject(
        `Unsupported: Dataset does not contain gtdbtk result: ${dataset}`
      );
    }
    if (bakta.length > 1)
      return Promise.reject(
        `Unsupported: Dataset constains multiple gtdbtk results: ${dataset}`
      );
    return fetch(bakta[0].url).then(this.toJson).then(GtdbtkResultSchema.parse);
  }
}

function useApi(): BakrepApi {
  console.log(baseurl);
  return new BakrepApiImpl(baseurl);
}

export type { BakrepApi };
export { initApi, useApi };
