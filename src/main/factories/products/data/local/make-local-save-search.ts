import { LocalStorageClient } from '@/infra/local-storage-client';
import { LocalSaveSearch } from '@/products/data/local/save-search';

export function makeLocalSaveSearch(): LocalSaveSearch {
  return new LocalSaveSearch(new LocalStorageClient());
}
