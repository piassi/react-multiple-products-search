import { ProductsSearch } from '../domain/use-cases/products-search';
import { Product } from '../domain/models/product';

export class EbayProductsSearch implements ProductsSearch {
  execute(search: string): Promise<Product[]> {
    return Promise.resolve(null);
  }
}
