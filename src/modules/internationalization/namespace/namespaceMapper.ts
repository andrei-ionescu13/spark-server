import { DomainValidationError } from '../../blog/article/domain/status';
import { NamespaceDoc } from './model';
import { Namespace } from './domain/namespace';
import { NamespaceTranslation } from './domain/namespaceTranslation';

export interface NamespacePersistance {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  translations: Array<{
    key: string;
    [key: string]: string;
  }>;
}

export interface NamespaceDto {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  translations: Array<{
    key: string;
    [key: string]: string;
  }>;
}

export class NamespaceMapper {
  public static toDomain(entity: NamespaceDoc): Namespace {
    const translations = entity.translations.map((_translation) =>
      NamespaceTranslation.reconstitute(_translation),
    );

    const namespace = Namespace.reconstitute({
      _id: entity._id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      translations,
    });

    return namespace;
  }

  public static toDto(entity: NamespaceDoc): NamespaceDto {
    return {
      _id: entity._id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      translations: entity.translations,
    };
  }

  public static toDtoList(entities: NamespaceDoc[]): NamespaceDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Namespace): NamespacePersistance {
    return {
      _id: entity._id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      translations: entity.translations.map((translation) => ({
        key: translation.key,
        ...translation.translations,
      })),
    };
  }
}
