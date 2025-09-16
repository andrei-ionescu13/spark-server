import { Mapper } from '../blog/mapper';
import { Admin } from './admin';
import { AdminDoc } from './model';

export const AdminMapper: Mapper<AdminDoc, Admin> = {
  toDomain(entity) {
    return new Admin({
      _id: entity._id,
      username: entity.username,
      password: entity.password,
    });
  },
};
