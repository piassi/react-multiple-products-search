import {
  ProductsSearch,
  ProductsSearchArgs,
} from '../../domain/use-cases/products-search';
import { Product } from '../../domain/models/product';

export class LocalProductsSearch implements ProductsSearch {
  async execute(searchArgs: ProductsSearchArgs): Promise<Product[]> {
    return await Promise.resolve([
      {
        id: 'local',
        name: 'Soy localito',
        price: '20',
      },
    ]);
  }
}
