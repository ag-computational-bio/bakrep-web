import json5 from "json5";
import {
  BakrepSearchResultSchema,
  type BakrepSearchResult,
} from "./model/BakrepSearchResult";
import { BaktaResultSchema, type BaktaResult } from "./model/BaktaResults";
import { CheckmResultSchema, type CheckmResult } from "./model/CheckmResults";
import { DatasetSchema, type Dataset } from "./model/Dataset";
import { GtdbtkResultSchema, type GtdbtkResult } from "./model/GtdbtkResult";
import { MlstResultSchema, type MlstResult } from "./model/MlstResults";
import type { SearchInfo, SearchRequest } from "./model/Search";
import {
  tsvSearchResultFromText,
  type TsvSearchResult,
} from "./model/TsvSearchResult";

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
  search(request: SearchRequest): Promise<BakrepSearchResult>;
  searchTsv(
    request: SearchRequest,
    includeHeader?: boolean,
    abort?: AbortController | undefined,
  ): Promise<TsvSearchResult>;
  searchinfo(): Promise<SearchInfo>;
}

class BakrepApiImpl implements BakrepApi {
  baseurl: string;
  constructor(baseurl: string) {
    this.baseurl = baseurl;
  }

  toJson(r: Response): Promise<any> {
    if (!r.ok)
      return r
        .text()
        .then((t) => Promise.reject(`${r.status}: ${r.statusText}\n${t}`));
    return r.text().then(json5.parse);
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
      (x) => x.attributes.tool === "bakta" && x.attributes.filetype === "json",
    );
    if (bakta.length == 0) {
      return Promise.reject(
        `Unsupported: Dataset does not contain bakta result: ${dataset}`,
      );
    }
    if (bakta.length > 1)
      return Promise.reject(
        `Unsupported: Dataset constains multiple bakta results: ${dataset}`,
      );
    return fetch(bakta[0].url).then(this.toJson).then(BaktaResultSchema.parse);
  }
  fetchGtdbtkResult(dataset: Dataset): Promise<GtdbtkResult> {
    const gtdb = dataset.results.filter(
      (x) => x.attributes.tool === "gtdbtk" && x.attributes.filetype === "json",
    );
    if (gtdb.length == 0) {
      return Promise.reject(
        `Unsupported: Dataset does not contain gtdbtk result: ${dataset}`,
      );
    }
    if (gtdb.length > 1)
      return Promise.reject(
        `Unsupported: Dataset constains multiple gtdbtk results: ${dataset}`,
      );
    return fetch(gtdb[0].url).then(this.toJson).then(GtdbtkResultSchema.parse);
  }
  fetchCheckmResult(dataset: Dataset): Promise<CheckmResult> {
    const checkm = dataset.results.filter(
      (x) =>
        x.attributes.tool === "checkm2" && x.attributes.filetype === "json",
    );
    if (checkm.length == 0) {
      return Promise.reject(
        `Unsupported: Dataset does not contain checkm result: ${dataset}`,
      );
    }
    if (checkm.length > 1) {
      return Promise.reject(
        `Unsupported: Dataset constains multiple checkm results: ${dataset}`,
      );
    }
    return fetch(checkm[0].url)
      .then(this.toJson)
      .then(CheckmResultSchema.parse);
  }
  fetchMlstResult(dataset: Dataset): Promise<MlstResult> {
    const mlst = dataset.results.filter(
      (x) => x.attributes.tool === "mlst" && x.attributes.filetype === "json",
    );
    if (mlst.length == 0) {
      return Promise.reject(
        `Unsupported: Dataset does not contain mlst result: ${dataset}`,
      );
    }
    if (mlst.length > 1) {
      return Promise.reject(
        `Unsupported: Dataset constains multiple mlst results: ${dataset}`,
      );
    }
    return fetch(mlst[0].url).then(this.toJson).then(MlstResultSchema.parse);
  }
  searchinfo(): Promise<SearchInfo> {
    return fetch(baseurl + "/search/_info")
      .then(this.toJson)
      .then((j) => j as SearchInfo);
  }
  search(request: SearchRequest): Promise<BakrepSearchResult> {
    return fetch(baseurl + "/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then(this.toJson)
      .then((j) => BakrepSearchResultSchema.parse(j));
  }
  searchTsv(
    request: SearchRequest,
    includeHeader = true,
    abort: AbortController | undefined = undefined,
  ): Promise<TsvSearchResult> {
    let path = baseurl + "/search";
    if (!includeHeader) path += "?header=false";
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/tab-separated-values",
      },
      body: JSON.stringify(request),
    };
    if (abort) options.signal = abort.signal;
    return fetch(path, options)
      .then((r) => {
        if (!r.ok)
          return r
            .text()
            .then((t) => Promise.reject(`${r.status}: ${r.statusText}\n${t}`));
        return r.text();
      })
      .then(tsvSearchResultFromText);
  }
}

function useApi(): BakrepApi {
  return new BakrepApiImpl(baseurl);
}

export { initApi, useApi };
export type { BakrepApi };
