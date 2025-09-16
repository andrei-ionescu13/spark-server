export interface Mapper<Doc, Domain> {
  toDomain: (entity: Doc) => Domain;
}
