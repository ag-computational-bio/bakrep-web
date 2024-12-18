import { type BakrepApi } from "@/BakrepApi";
import type { PaginationData } from "@/components/pagination/Pagination";
import type { Query, SearchAfter, SortOption } from "@/model/Search";
import { ref } from "vue";
import { saveAs } from "file-saver";

/**
 * Downloads all entries for the query as a tsv element. The data is loaded in chunks (chunksize it hard coded to 2000 at the moment).
 * An observer will be informed about progress. Each request may be retried up to three times. If it does not succeed the error handler
 * will be notified.
 * The onProgress handler is notified after each chunk is loaded.
 * The onFinished handler is notified once when all chunks are loaded.
 *
 * @param api
 * @param req
 * @param handler
 */
function downloadFullTsv(
  api: BakrepApi,
  req: ExportRequest,
  handler: ExportHandler,
): AbortController {
  const abort = new AbortController();
  let total = 0;
  let count = 0;
  const chunks: string[] = [];
  function sendQuery(searchAfter: SearchAfter = [], retry = 0) {
    api
      .searchTsv(
        {
          search_after: searchAfter,
          limit: 2000,
          query: req.query,
          sort: req.sort,
        },
        true,
        abort,
      )
      .then((resp) => {
        if (resp.total !== total) total = resp.total;
        if (chunks.length === 0) chunks.push(resp.header);
        chunks.push(resp.data);
        count = count + countMatches(resp.data, "\n");

        const progress = total === 0 ? 1 : count / total;
        const progressEvent = {
          total: total,
          count: count,
          progress: progress,
        };
        handler.onProgress(progressEvent);
        if (count === total || resp.data.length === 0) {
          // done
          handler.onFinished(chunks.join(""));
        } else {
          // request next chunk
          sendQuery(resp.search_after);
        }
      })
      .catch((err) => {
        if (retry >= 2) {
          handler.onError(err);
        } else {
          sendQuery(searchAfter, retry + 1);
        }
      });
  }

  sendQuery();
  return abort;
}

function countMatches(s: string, substring: string): number {
  let count = 0;
  let idx = s.indexOf(substring, 0);
  while (idx >= 0) {
    count++;
    idx = s.indexOf(substring, idx + 1);
  }
  return count;
}
export type ExportHandler = {
  onProgress: (progress: ProgressEvent) => void;
  onFinished: (tsv: string) => void;
  onError: (err: unknown) => void;
};

export type ExportRequest = {
  query: Query;
  sort: SortOption[];
};

export type ProgressEvent = {
  progress: number;
  total: number;
  count: number;
};

export function useExportTsv(api: BakrepApi) {
  let cancelExport: AbortController | undefined = undefined;
  const progress = ref<ProgressEvent>();
  const exportError = ref<string>();
  const exportInProgress = ref(false);
  function exportTsv(query: Query, pagination: PaginationData): Promise<void> {
    return new Promise((res, rej) => {
      const queryCopy = JSON.parse(JSON.stringify(query));
      exportError.value = undefined;
      exportInProgress.value = true;
      progress.value = { total: pagination.total, count: 0, progress: 0 };
      cancelExport = downloadFullTsv(
        api,
        {
          query: queryCopy,
          sort: [{ field: "id", ord: "asc" }],
        },
        {
          onError: (e) => {
            exportError.value = e as string;
            exportInProgress.value = false;
            rej(e);
          },
          onFinished: (d) => {
            const blob = new Blob([d], {
              type: "text/tab-separated-values;charset=utf-8",
            });
            saveAs(blob, "bakrep-export.tsv");
            exportInProgress.value = false;
            cancelExport = undefined;
            res();
          },
          onProgress: (p) => (progress.value = p),
        },
      );
    });
  }
  function cancelTsvExport() {
    if (cancelExport) cancelExport.abort();
  }
  function resetTsvExport() {
    cancelTsvExport();
    progress.value = undefined;
    exportError.value = undefined;
    exportInProgress.value = false;
  }
  return {
    cancelTsvExport,
    exportTsv,
    resetTsvExport,
    progress,
    exportError,
    exportInProgress,
  };
}
