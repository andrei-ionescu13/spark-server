import { TokenDto, TokenMapper } from '../../tokenMapper';
import { TokenDoc } from '../../model';
import { Collection } from 'mongodb';

export interface TokenQueriesRepoI {
  findOne: (token: string, admin: string) => Promise<TokenDto | null>;
}

export class TokenQueriesRepo implements TokenQueriesRepoI {
  constructor(private collection: Collection<TokenDoc>) {}

  findOne = async (token: string, admin: string) => {
    const doc = await this.collection.findOne({ token, admin });
    if (!doc) return null;

    return TokenMapper.toDto(doc);
  };
}
