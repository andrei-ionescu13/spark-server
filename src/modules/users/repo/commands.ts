import { Collection } from 'mongodb';
import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../../Result';
import { UserDoc } from '../model';
import { User } from '../user';
import { UserMapper } from '../userMapper';

export interface UserCommandsRepoI {
  getUser: (id: string) => Promise<Result<User | null, DomainValidationError>>;
  deleteReview: (id: string, reviewId: string) => Promise<void>;
  save: (user: User) => Promise<void>;
}

export class UserCommandsRepo implements UserCommandsRepoI {
  constructor(private collection: Collection<UserDoc>) {}

  getUser = async (id: string): Promise<Result<User | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const userOrError = UserMapper.toDomain(doc);
    if (userOrError.isErr()) {
      return Result.fail(new DomainValidationError(userOrError.error.message));
    }

    const user = userOrError.value;
    return Result.ok(user);
  };

  deleteReview = async (id: string, reviewId: string): Promise<void> => {
    await this.collection.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          reviews: reviewId,
        },
      },
    );
  };

  save = async (user: User): Promise<void> => {
    const persistence = UserMapper.toPersistance(user);
    await this.collection.updateOne({ _id: user._id }, { $set: persistence }, { upsert: true });
  };
}
