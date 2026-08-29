import { TokenDoc } from '../../model';
import { TokenMapper } from '../../tokenMapper';
import { Token } from '../../token';
import { Result } from '../../../../Result';
import { DomainValidationError } from '../../../blog/article/status';
import { Collection } from 'mongodb';

export interface TokenCommandsRepoI {
  save: (token: Token) => Promise<void>;
  findOne: (token: string, admin: string) => Promise<Result<Token | null, DomainValidationError>>;
}

export class TokenCommandsRepo implements TokenCommandsRepoI {
  constructor(private collection: Collection<TokenDoc>) {}

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

  findOne = async (
    value: string,
    admin: string,
  ): Promise<Result<Token | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ value, admin });
    if (!doc) return Result.ok(null);

    const tokenOrError = TokenMapper.toDomain(doc);
    if (tokenOrError.isErr())
      return Result.fail(new DomainValidationError(tokenOrError.error.message));

    const token = tokenOrError.value;
    return Result.ok(token);
  };
}
