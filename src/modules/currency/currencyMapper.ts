import { Currency } from './domain/currency';
import { CurrencyDoc } from './model';

export interface CurrencyDto {
  name: string;
  code: string;
  symbol: string;
  _id: string;
}

export class CurrencyMapper {
  static toDto(entity: CurrencyDoc): CurrencyDto {
    return {
      name: entity.name,
      code: entity.code,
      symbol: entity.symbol,
      _id: entity._id,
    };
  }

  static toDtoList(entities: Currency[]): CurrencyDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Currency): CurrencyDoc {
    return {
      _id: entity._id,
      code: entity.code,
      name: entity.name,
      symbol: entity.symbol,
    };
  }
}
