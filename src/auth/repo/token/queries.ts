import { Model } from 'mongoose';
import { TokenDto, TokenMapper } from '../../tokenMapper';
import { TokenDoc } from '../../model';

export interface TokenQueriesRepoI {
  findOne: (token: string, admin: string) => Promise<TokenDto | null>;
}

export class TokenQueriesRepo implements TokenQueriesRepoI {
  constructor(private tokenModel: Model<TokenDoc>) {}

  findOne = async (token: string, admin: string) => {
    const doc = await this.tokenModel.findOne({ token, admin });
    if (!doc) return null;

    return TokenMapper.toDto(doc);
  };
}
