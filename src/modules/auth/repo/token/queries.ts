import { TokenDto, TokenMapper } from '../../tokenMapper';
import { TokenDoc } from '../../model';
import { Collection } from 'mongodb';
import { Mongo } from '../../../../mongo';

export interface TokenQueriesRepoI {
  findOne: (token: string, admin: string) => Promise<TokenDto | null>;
}

export class TokenQueriesRepo implements TokenQueriesRepoI {
  collection = Mongo.getCollection<TokenDoc>('tokens');

  findOne = async (token: string, admin: string) => {
    const doc = await this.collection.findOne({ token, admin });
    if (!doc) return null;

    return TokenMapper.toDto(doc);
  };
}
