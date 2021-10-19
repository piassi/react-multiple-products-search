import {
  ProductsSearch,
  ProductsSearchArgs,
} from '../../domain/use-cases/products-search';
import { Product } from '../../domain/models/product';
import { LocalLoadResource } from '@/data/local';
import { LOCAL_SEARCH_KEY } from './constants';

export class LocalProductsSearch implements ProductsSearch {
  constructor(private readonly localLoadResource: LocalLoadResource) {}

  filterProducts(
    productsToFilter: Product[],
    searchArgs: ProductsSearchArgs
  ): Product[] {
    const { search } = searchArgs;

    return productsToFilter.filter((p) =>
      p.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  }

  async execute(searchArgs: ProductsSearchArgs): Promise<Product[]> {
    const products = this.localLoadResource.load<Product[]>(LOCAL_SEARCH_KEY);
    return await Promise.resolve(this.filterProducts(products, searchArgs));
  }
}
