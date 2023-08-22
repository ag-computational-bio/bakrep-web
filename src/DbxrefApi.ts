let baseurl: string = "http://localhost:8080";
export function initDbxrefApi(url: string) {
  baseurl = url;
}

export interface DbxrefApi {
  redirectUrl(dbxref: string): string;
}

class DbxrefApiImpl implements DbxrefApi {
  baseurl: string;
  constructor(baseurl: string) {
    this.baseurl = baseurl;
  }

  redirectUrl(dbxref: string): string {
    return baseurl + "/redirect/" + dbxref;
  }
}

export function useDbxrefApi(): DbxrefApi {
  return new DbxrefApiImpl(baseurl);
}
