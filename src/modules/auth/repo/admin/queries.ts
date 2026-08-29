import { Collection } from 'mongodb';
import { AdminDto, AdminMapper } from '../../adminMapper';
import { AdminDoc } from '../../model';

export interface AdminQueriesRepoI {
  getAdmin: (id: string) => Promise<AdminDto | null>;
  getAdminByUsername: (username: string) => Promise<AdminDto | null>;
}

export class AdminQueriesRepo implements AdminQueriesRepoI {
  constructor(private collection: Collection<AdminDoc>) {}

  getAdmin = async (id: string): Promise<AdminDto | null> => {
    const entity = await this.collection.findOne({ _id: id });
    if (!entity) return null;

    return AdminMapper.toDto(entity);
  };

  getAdminByUsername = async (username: string): Promise<AdminDto | null> => {
    const entity = await this.collection.findOne({ username });
    if (!entity) return null;

    return AdminMapper.toDto(entity);
  };
}
