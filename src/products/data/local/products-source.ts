import {
  ProductsSource,
  ProductsSearchArgs,
} from '../../domain/use-cases/products-source';
import { Product } from '../../domain/models/product';
import { LocalLoadResource } from '@/data/local';
import { LOCAL_SEARCH_KEY } from './constants';

export class LocalProductsSource implements ProductsSource {
  constructor(private readonly localLoadResource: LocalLoadResource) {}

  filterProducts(
    productsToFilter: Product[],
    searchArgs: ProductsSearchArgs
  ): Product[] {
    const { search, minPrice, maxPrice } = searchArgs;

    return productsToFilter.filter((p) => {
      const nameMatches = p.name
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase());

      let hasMinPrice = true;
      let hasMaxPrice = true;

      if (minPrice) {
        hasMinPrice = parseInt(p.price) >= parseInt(minPrice);
      }

      if (maxPrice) {
        hasMaxPrice = parseInt(p.price) <= parseInt(maxPrice);
      }

      return nameMatches && hasMinPrice && hasMaxPrice;
    });
  }

  async search(searchArgs: ProductsSearchArgs): Promise<Product[]> {
    const products = this.localLoadResource.load<Product[]>(LOCAL_SEARCH_KEY);
    return await Promise.resolve(this.filterProducts(products, searchArgs));
  }
}
