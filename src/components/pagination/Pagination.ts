export type PaginationData = {
  offset: number;
  limit: number;
  total: number;
};

export type PaginationModel = {
  lastPage: number;
  currentPage: number;
  visiblePages: number[];
  showDotsBefore: boolean;
  showDotsAfter: boolean;
};

export type PositionInResult = {
  lastElement: number;
  firstElement: number;
};

export function currentPage(data: PaginationData): number {
  if (data.total === 0) return NaN;
  if (data.total < data.offset) return NaN;
  return data.offset / data.limit + 1;
}
export function lastPage(data: PaginationData): number {
  if (data.total === 0) return NaN;
  return Math.ceil(data.total / data.limit);
}
export function pages(data: PaginationData, before = 2, after = 2): number[] {
  const lastPage_ = lastPage(data);
  const currentPage_ = currentPage(data);
  if (isNaN(lastPage_)) return [];
  const pages: number[] = [];
  let start = currentPage_ - before;
  if (start < 1 || isNaN(currentPage_)) start = 1;

  let end = currentPage_ + after;
  if (isNaN(currentPage_)) {
    end = start + after;
  }
  if (end > lastPage_) end = lastPage_;
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

function lastElement(data: PaginationData): number {
  const last = data.offset + data.limit;
  if (last > data.total) return data.total;
  return last;
}
function firstElement(data: PaginationData): number {
  if (data.total === 0) return 0;
  return data.offset + 1;
}

export function toModel(data: PaginationData): PaginationModel {
  const lp = lastPage(data);
  const vp = pages(data);
  let dotsBefore = true;
  if (vp && vp[0] === 1) dotsBefore = false;
  let dotsAfter = true;
  if (vp && vp[vp.length - 1] === lp) dotsAfter = false;

  return {
    currentPage: currentPage(data),
    lastPage: lp,
    visiblePages: vp,
    showDotsBefore: dotsBefore,
    showDotsAfter: dotsAfter,
  };
}

export function toPosition(data: PaginationData): PositionInResult {
  return {
    firstElement: firstElement(data),
    lastElement: lastElement(data),
  };
}
export function empty(): PaginationData {
  return { limit: 20, offset: 0, total: 0 };
}
