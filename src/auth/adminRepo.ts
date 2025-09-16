import { Model } from 'mongoose';
import { Admin } from './admin';
import { AdminMapper } from './adminMapper';
import { AdminDoc } from './model';

export interface AdminRepoI {
  createAdmin: (props: { username: string; password: string }) => Promise<Admin>;
  getAdminByUsername: (username: string) => Promise<Admin | null>;
  getAdmin: (id: string) => Promise<Admin | null>;
}

export class AdminRepo implements AdminRepoI {
  constructor(private adminModel: Model<AdminDoc>) {}

  createAdmin = async (props: { username: string; password: string }) => {
    const entity = await this.adminModel.create(props);

    return AdminMapper.toDomain(entity);
  };

  getAdminByUsername = async (username: string) => {
    const entity = await this.adminModel.findOne({ username: username });
    if (!entity) return null;

    return AdminMapper.toDomain(entity);
  };

  getAdmin = async (id: string) => {
    const entity = await this.adminModel.findOne({ _id: id });
    if (!entity) return null;

    return AdminMapper.toDomain(entity);
  };
}
