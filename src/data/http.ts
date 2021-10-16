export enum HttpStatusCodes {
  success = 200,
  internalServerError = 500,
}

export type HttpResponse<T> = {
  statusCode: HttpStatusCodes;
  body?: T;
};

export type HttpPostParams<T> = {
  url: string;
  body?: T;
  headers?: Record<string, unknown>;
};

export interface HttpPostClient<T, K> {
  post: (params: HttpPostParams<T>) => Promise<HttpResponse<K>>;
}
