import { DomainValidationError } from '../blog/article/status';
import { Result } from '../../Result';
import { Key } from './key';
import { KeyAvailability } from './keyAvailability';
import { KeyStatus } from './keyStatus';
import { KeyValue } from './keyValue';
import { KeyDoc } from './model';

export interface KeyDto {
  product: string;
  createdAt: Date;
  value: string;
  availability: string;
  status: string;
  _id: string;
}

export class KeyMapper {
  public static toDomain(entity: KeyDoc): Result<Key, DomainValidationError> {
    const availabilityOrError = KeyAvailability.create(entity.availability);
    const statusOrError = KeyStatus.create(entity.status);
    const keyValueOrError = KeyValue.create(entity.value);

    const result = Result.combine([availabilityOrError, statusOrError, keyValueOrError]);

    if (result.isErr()) {
      return Result.fail(new DomainValidationError(result.error.message));
    }

    const availability = availabilityOrError.value;
    const status = statusOrError.value;
    const value = keyValueOrError.value;

    const keyOrError = Key.create({
      _id: entity._id,
      product: entity.product,
      createdAt: entity.createdAt,
      value,
      availability,
      status,
    });

    if (keyOrError.isErr()) {
      return Result.fail(new DomainValidationError(keyOrError.error.message));
    }

    const key = keyOrError.value;
    return Result.ok(key);
  }

  static toDto(entity: KeyDoc): KeyDto {
    return {
      product: entity.product,
      createdAt: entity.createdAt,
      value: entity.value,
      availability: entity.availability,
      status: entity.status,
      _id: entity._id,
    };
  }

  static toDtoList(entities: any[]): KeyDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Key): KeyDoc {
    return {
      product: entity.product,
      createdAt: entity.createdAt,
      value: entity.value.value,
      availability: entity.availability.value,
      status: entity.status.value,
      _id: entity._id,
    };
  }
}
