import { Product } from '../models/product';

export interface ProductsSearch {
  execute: (search: string) => Promise<Product[]>;
}
