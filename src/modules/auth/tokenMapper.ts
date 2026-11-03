import { MappingValidationError } from '../blog/article/domain/status';
import { TokenDoc } from './model';
import { Token } from './domain/token';

export interface TokenDto {
  _id: string;
  admin: string;
  value: string;
  expiresAt: Date;
  type: string;
}

export class TokenMapper {
  static toDomain(doc: TokenDoc): Token {
    const token = Token.reconstitute(doc);
    return token;
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
