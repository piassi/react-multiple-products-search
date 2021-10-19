import { Product } from '../models/product';

export type ProductsSearchArgs = {
  search: string;
  minPrice?: string;
  maxPrice?: string;
};

export interface ProductsSource {
  search: (searchArgs: ProductsSearchArgs) => Promise<Product[]>;
}
