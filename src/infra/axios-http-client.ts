import { HttpPostClient, HttpPostParams, HttpResponse } from '@/data/http';
import axios, { AxiosStatic } from 'axios';

export class AxiosHttpClient implements HttpPostClient<any, any> {
  axios: AxiosStatic = axios;

  async post(params: HttpPostParams<any>): Promise<HttpResponse<any>> {
    const { url, body, headers } = params;
    const { status, data } = await this.axios.post(url, body, {
      headers,
    });
    return {
      statusCode: status,
      body: data,
    };
  }
}
