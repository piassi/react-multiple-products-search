import { Product } from '../models/product';

export type ProductsSearchArgs = {
  search: string;
  minPrice?: string;
  maxPrice?: string;
};

export interface ProductsSearch {
  execute: (searchArgs: ProductsSearchArgs) => Promise<Product[]>;
}
