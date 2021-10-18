import { LocalProductsSearch } from '@/products/data/local/products-search';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';

export function makeLocalProductsSearch(): ProductsSearch {
  return new LocalProductsSearch();
}
