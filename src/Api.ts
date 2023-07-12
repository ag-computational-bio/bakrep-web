import { inflate } from 'pako';

const BASEURL = 'http://localhost:8081/';
function getDatasetById(id: string) {
  let dataset: Promise<Dataset> = Promise.resolve(api<Dataset>(BASEURL + id))
  .then((data: Dataset) => {
    const promises = data.results.map((r) => getResultData(r.url)
      .then((d: any) => r.data = d))
    return Promise.all(promises).then(() => {return data})
  });
  return dataset
}

function getResultData(url: string): any {
  return Promise.resolve(apiGzip<any>(url))
    .then((res) => {
      return res
    })
}

function api<T>(url: string): Promise<T> {
  return fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  })
}

function apiGzip<T>(url: string): Promise<T> {
  return fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.arrayBuffer();
  })
  .then(arrayBuffer => {
    let result = inflate(arrayBuffer, { to: 'string'})
    return JSON.parse(result) as Promise<T>
  })
}

export { getDatasetById }
