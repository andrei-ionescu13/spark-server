import { TokenDoc } from '../../model';
import { TokenMapper } from '../../tokenMapper';
import { Token } from '../../domain/token';
import { Result } from '../../../../result';
import { Collection } from 'mongodb';
import { Mongo } from '../../../../mongo';

export interface TokenCommandsRepoI {
  save: (token: Token) => Promise<void>;
  findOne: (token: string, admin: string) => Promise<Token | null>;
}

export class TokenCommandsRepo implements TokenCommandsRepoI {
  collection = Mongo.getCollection<TokenDoc>('tokens');

  save = async (token: Token) => {
    const persistence = TokenMapper.toPersistence(token);

    await this.collection.findOneAndUpdate(
      {
        _id: token._id,
      },
      { $set: persistence },
      { upsert: true },
    );
  };

  findOne = async (value: string, admin: string): Promise<Token | null> => {
    const doc = await this.collection.findOne({ value, admin });
    if (!doc) return null;

    const token = TokenMapper.toDomain(doc);
    return token;
  };
}
