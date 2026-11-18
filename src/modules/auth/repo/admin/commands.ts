import { DomainValidationError } from '../../../blog/article/domain/status';
import { Admin } from '../../domain/admin';
import { AdminDoc } from '../../model';
import { AdminMapper } from '../../adminMapper';
import { Collection } from 'mongodb';
import { Mongo } from '../../../../mongo';

export interface AdminCommandsRepoI {
  save: (admin: Admin) => Promise<void>;
  getAdminByUsername: (username: string) => Promise<Admin | null>;
  getAdmin: (id: string) => Promise<Admin | null>;
}

export class AdminCommandsRepo implements AdminCommandsRepoI {
  collection = Mongo.getCollection<AdminDoc>('admins');

  save = async (admin: Admin) => {
    const persistence = AdminMapper.toPersistence(admin);
    const { _id, ...props } = persistence;

    await this.collection.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: props,
        $setOnInsert: {
          _id,
        },
      },
      { upsert: true },
    );
  };

  getAdminByUsername = async (username: string): Promise<Admin | null> => {
    const doc = await this.collection.findOne({ username });
    if (!doc) return null;

    const admin = AdminMapper.toDomain(doc);
    return admin;
  };

  getAdmin = async (id: string): Promise<Admin | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const admin = AdminMapper.toDomain(doc);
    return admin;
  };
}
