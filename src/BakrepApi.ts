import json5 from "json5";
import {
  BakrepSearchResultSchema,
  type BakrepSearchResult,
  type SimpleFeature,
} from "./model/BakrepSearchResult";
import { BaktaResultSchema, type BaktaResult } from "./model/BaktaResults";
import { CheckmResultSchema, type CheckmResult } from "./model/CheckmResults";
import { DatasetSchema, type Dataset } from "./model/Dataset";
import {
  GtdbtkResultSchema,
  type Classification,
  type GtdbtkResult,
} from "./model/GtdbtkResult";
import { MlstResultSchema, type MlstResult } from "./model/MlstResults";
import type { SearchInfo, SearchRequest } from "./model/Search";
import {
  RepositoryStatisticsSchema,
  type RepositoryStatistics,
} from "./model/statistics/RepositoryStatistics";
import {
  KeywordCountsSchema,
  type KeywordCounts,
} from "./model/statistics/KeywordCounts";

import {
  tsvSearchResultFromText,
  type TsvSearchResult,
} from "./model/TsvSearchResult";
import { MetadataSchema, type Metadata } from "./model/Metadata";
import {
  StringCompletionResultSchema,
  type StringCompletionResult,
} from "./model/CompletionResult";

let baseurl: string = "http://localhost:8080";
function initApi(url: string) {
  baseurl = url;
}

interface BakrepApi {
  getDataset(id: string): Promise<Dataset>;
  fetchBaktaResult(dataset: Dataset): Promise<BaktaResult | undefined>;
  fetchGtdbtkResult(dataset: Dataset): Promise<GtdbtkResult | undefined>;
  fetchCheckmResult(dataset: Dataset): Promise<CheckmResult | undefined>;
  fetchMlstResult(dataset: Dataset): Promise<MlstResult | undefined>;
  fetchMetadata(dataset: Dataset): Promise<Metadata | undefined>;
  fetchGenusStatistics(): Promise<KeywordCounts>;
  fetchSpeciesStatistics(): Promise<KeywordCounts>;
  fetchSummary(): Promise<RepositoryStatistics>;
  search(request: SearchRequest): Promise<BakrepSearchResult>;
  searchTsv(
    request: SearchRequest,
    includeHeader?: boolean,
    abort?: AbortController | undefined,
  ): Promise<TsvSearchResult>;
  searchinfo(): Promise<SearchInfo>;
  completeClassficationText(
    field: keyof Classification,
    prefix: string,
  ): Promise<StringCompletionResult>;
  completeFeatureText(
    field: keyof SimpleFeature,
    prefix: string,
  ): Promise<StringCompletionResult>;
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

  fetchBaktaResult(dataset: Dataset): Promise<BaktaResult | undefined> {
    const bakta = dataset.results.filter(
      (x) => x.attributes.tool === "bakta" && x.attributes.filetype === "json",
    );
    if (bakta.length == 0) return Promise.resolve(undefined);

    if (bakta.length > 1)
      return Promise.reject(
        `Unsupported: Dataset constains multiple bakta results: ${dataset}`,
      );
    return fetch(bakta[0].url).then(this.toJson).then(BaktaResultSchema.parse);
  }
  fetchGtdbtkResult(dataset: Dataset): Promise<GtdbtkResult | undefined> {
    const gtdb = dataset.results.filter(
      (x) => x.attributes.tool === "gtdbtk" && x.attributes.filetype === "json",
    );
    if (gtdb.length == 0) return Promise.resolve(undefined);

    if (gtdb.length > 1)
      return Promise.reject(
        `Unsupported: Dataset constains multiple gtdbtk results: ${dataset}`,
      );
    return fetch(gtdb[0].url).then(this.toJson).then(GtdbtkResultSchema.parse);
  }
  fetchCheckmResult(dataset: Dataset): Promise<CheckmResult | undefined> {
    const checkm = dataset.results.filter(
      (x) =>
        x.attributes.tool === "checkm2" && x.attributes.filetype === "json",
    );
    if (checkm.length == 0) {
      return Promise.resolve(undefined);
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
  fetchMlstResult(dataset: Dataset): Promise<MlstResult | undefined> {
    const mlst = dataset.results.filter(
      (x) => x.attributes.tool === "mlst" && x.attributes.filetype === "json",
    );
    if (mlst.length == 0) return Promise.resolve(undefined);

    if (mlst.length > 1) {
      return Promise.reject(
        `Unsupported: Dataset constains multiple mlst results: ${dataset}`,
      );
    }
    return fetch(mlst[0].url).then(this.toJson).then(MlstResultSchema.parse);
  }
  fetchMetadata(dataset: Dataset): Promise<Metadata | undefined> {
    const metadata = dataset.results.filter(
      (x) =>
        x.attributes.type === "metadata" && x.attributes.filetype === "json",
    );
    if (metadata.length == 0) return Promise.resolve(undefined);

    if (metadata.length > 1) {
      return Promise.reject(
        `Unsupported: Dataset constains multiple metadata files: ${dataset}`,
      );
    }
    return fetch(metadata[0].url).then(this.toJson).then(MetadataSchema.parse);
  }
  fetchSummary(): Promise<RepositoryStatistics> {
    return fetch(baseurl + "/stats/summary")
      .then(this.toJson)
      .then(RepositoryStatisticsSchema.parse);
  }
  fetchGenusStatistics(): Promise<KeywordCounts> {
    return fetch(baseurl + "/stats/genus")
      .then(this.toJson)
      .then(KeywordCountsSchema.parse);
  }
  fetchSpeciesStatistics(): Promise<KeywordCounts> {
    return fetch(baseurl + "/stats/species")
      .then(this.toJson)
      .then(KeywordCountsSchema.parse);
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
  completeClassficationText(field: keyof Classification, prefix: string) {
    return fetch(`${baseurl}/completion/classification/${field}/${prefix}`, {
      method: "GET",
    })
      .then(this.toJson)
      .then((j) => StringCompletionResultSchema.parse(j));
  }
  completeFeatureText(field: keyof SimpleFeature, prefix: string) {
    return fetch(`${baseurl}/completion/feature/${field}/${prefix}`, {
      method: "GET",
    })
      .then(this.toJson)
      .then((j) => StringCompletionResultSchema.parse(j));
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
