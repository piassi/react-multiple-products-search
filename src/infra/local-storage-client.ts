import { LocalSaveResource } from '@/data/local';

export class LocalStorageClient implements LocalSaveResource {
  save<T>(key: string, resource: T): void {
    localStorage.setItem(key, JSON.stringify(resource));
  }
}
