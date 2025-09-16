import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../Result';
import { NamespaceDoc } from './model';
import { Namespace } from './namespace';
import { NamespaceTranslation } from './namespaceTransation';

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
  public static toDomain(entity: NamespaceDoc): Result<Namespace, DomainValidationError> {
    const translationsOrErrors = entity.translations.map((_translation) =>
      NamespaceTranslation.create(_translation),
    );

    const result = Result.combine(translationsOrErrors);

    if (result.isErr()) {
      return Result.fail(new DomainValidationError(result.error.message));
    }

    const translations = translationsOrErrors.map((translation) => translation.value);
    const namespaceOrError = Namespace.create({
      _id: entity._id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      translations,
    });
    if (namespaceOrError.isErr()) {
      return Result.fail(new DomainValidationError(namespaceOrError.error.message));
    }

    const namespace = namespaceOrError.value;
    return Result.ok(namespace);
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
