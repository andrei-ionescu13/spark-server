import { Mapper } from '../blog/mapper';
import { TokenDoc } from './model';
import { Token } from './token';

export const ToukenMapper: Mapper<TokenDoc, Token> = {
  toDomain(entity) {
    return new Token({
      _id: entity._id,
      admin: entity.admin,
      createdAt: entity.createdAt,
      expiresAt: entity.expiresAt,
      token: entity.token,
      type: entity.type,
    });
  },
};
