import { LocalStorageClient } from '@/infra/local-storage-client';
import { LocalProductsSource } from '@/products/data/local/products-source';
import { ProductsSource } from '@/products/domain/use-cases/products-source';

export function makeLocalProductsSearch(): ProductsSource {
  return new LocalProductsSource(new LocalStorageClient());
}
