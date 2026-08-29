import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../../Result';
import { Language } from './language';
import { LanguageCode } from './languageCode';
import { LanguageDoc } from './model';

export interface LanguageDto {
  name: string;
  code: string;
  nativeName: string;
  _id: string;
}

interface LanguagePersistance {
  name: string;
  code: string;
  nativeName: string;
  _id: string;
}

export class LanguageMapper {
  public static toDomain(entity: LanguageDoc): Result<Language, DomainValidationError> {
    const codeOrError = LanguageCode.create(entity.code);

    if (codeOrError.isErr()) {
      return Result.fail(new DomainValidationError(codeOrError.error.message));
    }
    const code = codeOrError.value;

    const languageOrError = Language.create({
      _id: entity._id,
      name: entity.name,
      nativeName: entity.nativeName,
      code,
    });

    if (languageOrError.isErr()) {
      return Result.fail(new DomainValidationError(languageOrError.error.message));
    }

    const developer = languageOrError.value;
    return Result.ok(developer);
  }

  static toDto(entity: any): LanguageDto {
    return {
      _id: entity._id,
      name: entity.name,
      nativeName: entity.nativeName,
      code: entity.code,
    };
  }

  static toDtoList(entities: any[]): LanguageDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Language): LanguagePersistance {
    return {
      _id: entity._id,
      name: entity.name,
      nativeName: entity.nativeName,
      code: entity.code.value,
    };
  }
}
