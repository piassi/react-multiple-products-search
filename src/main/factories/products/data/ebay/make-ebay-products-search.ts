import { AxiosHttpClient } from '@/infra/axios-http-client';
import { EbayProductsSource } from '@/products/data/ebay/products-source';
import { ProductsSource } from '@/products/domain/use-cases/products-source';

export function makeEbayProductsSearch(): ProductsSource {
  const httpClient = new AxiosHttpClient();

  return new EbayProductsSource(httpClient);
}
