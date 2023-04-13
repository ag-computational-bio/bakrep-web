
const BASEURL = 'http://localhost:8081/';
function getDatasetById(id: string) {
  let promise = Promise.resolve(api<Dataset>(BASEURL + id));
  
  let dataset = promise.then((data: Dataset) => {
    data.results.forEach((result: Result) => {
      api<any>(result.url).then(response => {
        result.data = response;
      });
    })
    return data;
  })
  .catch(error => {
    console.log(error);
  })
  return dataset
}

function api<T>(url: string): Promise<T> {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json<T>();
    })

}

export { getDatasetById }
