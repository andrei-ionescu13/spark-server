import { MappingValidationError } from '../blog/article/status';
import { Mapper } from '../blog/mapper';
import { Result } from '../../Result';
import { TokenDoc } from './model';
import { Token } from './token';

export interface TokenDto {
  _id: string;
  admin: string;
  value: string;
  expiresAt: Date;
  type: string;
}

export class TokenMapper {
  static toDomain(doc: TokenDoc): Result<Token, MappingValidationError> {
    const tokenOrError = Token.create(doc);
    if (tokenOrError.isErr())
      return Result.fail(new MappingValidationError(tokenOrError.error.message));

    const token = tokenOrError.value;
    return Result.ok(token);
  }

  static toPersistence(token: Token): TokenDoc {
    return {
      _id: token._id,
      admin: token.admin,
      value: token.value,
      expiresAt: token.expiresAt,
      createdAt: token.createdAt,
      type: token.type,
    };
  }

  static toDto(doc: TokenDoc): TokenDto {
    return {
      _id: doc._id,
      admin: doc.admin,
      value: doc.value,
      expiresAt: doc.expiresAt,
      type: doc.type,
    };
  }
}
