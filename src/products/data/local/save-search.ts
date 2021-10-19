import { LocalLoadResource, LocalSaveResource } from '@/data/local';
import { Product } from '@/products/domain/models/product';
import { SaveSearch } from '@/products/domain/use-cases/save-search';
import { LOCAL_SEARCH_KEY } from './constants';

export class LocalSaveSearch implements SaveSearch {
  constructor(
    private readonly localSaveResource: LocalSaveResource,
    private readonly localLoadesource: LocalLoadResource
  ) {}

  async execute(searchResults: Product[]): Promise<void> {
    const currentProducts =
      this.localLoadesource.load<Product[]>(LOCAL_SEARCH_KEY);

    this.localSaveResource.save(LOCAL_SEARCH_KEY, [
      ...currentProducts,
      ...searchResults,
    ]);
  }
}
