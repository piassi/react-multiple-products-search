import { Product } from '../models/product';

export interface SaveSearch {
  execute: (searchResults: Product[]) => Promise<void>;
}
