export interface LocalSaveResource {
  save: <T>(key: string, resource: T) => void;
}

export interface LocalLoadResource {
  load: <T>(key: string) => T;
}
