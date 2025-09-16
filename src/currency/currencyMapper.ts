import { DomainValidationError } from '../blog/article/status';
import { Result } from '../Result';
import { Currency } from './currency';
import { CurrencyDoc } from './model';

export interface CurrencyDto {
  name: string;
  code: string;
  symbol: string;
  _id: string;
}

interface CurrencyPersistance {
  name: string;
  code: string;
  symbol: string;
  _id: string;
}

export class CurrencyMapper {
  public static toDomain(entity: CurrencyDoc): Result<Currency, DomainValidationError> {
    const currencyOrError = Currency.create({
      name: entity.name,
      code: entity.code,
      symbol: entity.symbol,
      _id: entity._id,
    });

    if (currencyOrError.isErr()) {
      return Result.fail(new DomainValidationError(currencyOrError.error.message));
    }

    const currency = currencyOrError.value;
    return Result.ok(currency);
  }

  static toDto(entity: any): CurrencyDto {
    return {
      name: entity.name,
      code: entity.code,
      symbol: entity.symbol,
      _id: entity._id,
    };
  }

  static toDtoList(entities: any[]): CurrencyDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Currency): CurrencyPersistance {
    return {
      name: entity.name,
      code: entity.code,
      symbol: entity.symbol,
      _id: entity._id,
    };
  }
}
