import { Collection } from 'mongodb';
import { UserDoc } from '../model';
import { User } from '../domain/user';
import { UserMapper } from '../userMapper';

export interface UserCommandsRepoI {
  getUser: (id: string) => Promise<User | null>;
  deleteReview: (id: string, reviewId: string) => Promise<void>;
  save: (user: User) => Promise<void>;
}

export class UserCommandsRepo implements UserCommandsRepoI {
  constructor(private collection: Collection<UserDoc>) {}

  getUser = async (id: string): Promise<User | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const user = UserMapper.toDomain(doc);
    return user;
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
