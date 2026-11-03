import { DomainValidationError } from '../blog/article/domain/status';
import { Key } from './domain/key';
import { KeyAvailability } from './domain/keyAvailability';
import { KeyStatus } from './domain/keyStatus';
import { KeyValue } from './domain/keyValue';
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
  public static toDomain(entity: KeyDoc): Key {
    const availability = KeyAvailability.reconstitute(entity.availability);
    const status = KeyStatus.reconstitute(entity.status);
    const value = KeyValue.reconstitute(entity.value);

    const key = Key.reconstitute({
      _id: entity._id,
      product: entity.product,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,
      value,
      availability,
      status,
    });

    return key;
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
      updatedAt: entity.updatedAt,
    };
  }
}
