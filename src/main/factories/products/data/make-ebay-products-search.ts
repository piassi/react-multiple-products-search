import { AxiosHttpClient } from '@/infra/axios-http-client';
import { EbayProductsSearch } from '@/products/data/ebay/ebay-products-search';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';

export function makeEbayProductsSearch(): ProductsSearch {
  const httpClient = new AxiosHttpClient();

  return new EbayProductsSearch(httpClient);
}
