export interface LocalSaveResource {
  save: <T>(key: string, resource: T) => void;
}
