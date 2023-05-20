export interface Repo {
  exists: (id: string) => Promise<boolean>;
}
