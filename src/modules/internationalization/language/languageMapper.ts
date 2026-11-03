import { Language } from './domain/language';
import { LanguageCode } from './domain/languageCode';
import { LanguageDoc } from './model';

export interface LanguageDto {
  name: string;
  code: string;
  _id: string;
}

export class LanguageMapper {
  public static toDomain(entity: LanguageDoc): Language {
    const code = LanguageCode.reconstitute(entity.code);
    const language = Language.reconstitute({
      _id: entity._id,
      name: entity.name,
      code,
    });

    return language;
  }

  static toDto(entity: any): LanguageDto {
    return {
      _id: entity._id,
      name: entity.name,
      code: entity.code,
    };
  }

  static toDtoList(entities: any[]): LanguageDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Language): LanguageDoc {
    return {
      _id: entity._id,
      name: entity.name,
      code: entity.code.value,
    };
  }
}
