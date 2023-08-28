import { BaktaResultSchema, type BaktaResult } from "./model/BaktaResults";
import { CheckmResultSchema, type CheckmResult } from "./model/CheckmResults";
import { DatasetSchema, type Dataset } from "./model/Dataset";
import { GtdbtkResultSchema, type GtdbtkResult } from "./model/GtdbtkResult";
import { MlstResultSchema, type MlstResult } from "./model/MlstResults";

let baseurl: string = "http://localhost:8080";
function initApi(url: string) {
  baseurl = url;
}

interface BakrepApi {
  getDataset(id: string): Promise<Dataset>;
  fetchUrlContentAsJson(url: string): Promise<any>;
  fetchBaktaResult(dataset: Dataset): Promise<BaktaResult>;
  fetchGtdbtkResult(dataset: Dataset): Promise<GtdbtkResult>;
  fetchCheckmResult(dataset: Dataset): Promise<CheckmResult>;
  fetchMlstResult(dataset: Dataset): Promise<MlstResult>;
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
    const gtdb = dataset.results.filter(
      (x) => x.attributes.tool === "gtdbtk" && x.attributes.filetype === "json"
    );
    if (gtdb.length == 0) {
      return Promise.reject(
        `Unsupported: Dataset does not contain gtdbtk result: ${dataset}`
      );
    }
    if (gtdb.length > 1)
      return Promise.reject(
        `Unsupported: Dataset constains multiple gtdbtk results: ${dataset}`
      );
    return fetch(gtdb[0].url).then(this.toJson).then(GtdbtkResultSchema.parse);
  }
  fetchCheckmResult(dataset: Dataset): Promise<CheckmResult> {
    const checkm = dataset.results.filter(
      (x) => x.attributes.tool === "checkm2" && x.attributes.filetype === "json"
    );
    if (checkm.length == 0) {
      return Promise.reject(
        `Unsupported: Dataset does not contain checkm result: ${dataset}`
      );
    }
    if (checkm.length > 1) {
      return Promise.reject(
        `Unsupported: Dataset constains multiple checkm results: ${dataset}`
      );
    }
    return fetch(checkm[0].url).then(this.toJson).then(CheckmResultSchema.parse);
  }
  fetchMlstResult(dataset: Dataset): Promise<MlstResult> {
    const checkm = dataset.results.filter(
      (x) => x.attributes.tool === "checkm2" && x.attributes.filetype === "json"
    );
    if (checkm.length == 0) {
      return Promise.reject(
        `Unsupported: Dataset does not contain checkm result: ${dataset}`
      );
    }
    if (checkm.length > 1) {
      return Promise.reject(
        `Unsupported: Dataset constains multiple checkm results: ${dataset}`
      );
    }
    return fetch(checkm[0].url).then(this.toJson).then(CheckmResultSchema.parse);
  }
}

function useApi(): BakrepApi {
  return new BakrepApiImpl(baseurl);
}

export type { BakrepApi };
export { initApi, useApi };
