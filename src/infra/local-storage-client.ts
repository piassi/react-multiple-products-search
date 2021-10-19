import { LocalLoadResource, LocalSaveResource } from '@/data/local';

export class LocalStorageClient
  implements LocalSaveResource, LocalLoadResource
{
  save<T>(key: string, resource: T): void {
    localStorage.setItem(key, JSON.stringify(resource));
  }

  load<T>(key: string): T {
    const result = localStorage.getItem(key);
    return JSON.parse(result);
  }
}
