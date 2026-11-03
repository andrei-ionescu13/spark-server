import { MappingValidationError } from '../blog/article/domain/status';
import { Admin } from './domain/admin';
import { AdminUsername } from './domain/adminUsername';
import { AdminDoc } from './model';

export interface AdminDto {
  id: string;
  username: string;
}

export class AdminMapper {
  static toDomain(doc: AdminDoc): Admin {
    const username = AdminUsername.recreate(doc.username);
    const admin = Admin.reconstitute({
      username,
      _id: doc._id,
      passwordHash: doc.passwordHash,
    });

    return admin;
  }

  static toPersistence(admin: Admin): AdminDoc {
    return {
      _id: admin._id,
      username: admin.username.value,
      passwordHash: admin.passwordHash,
    };
  }

  static toDto(doc: AdminDoc): AdminDto {
    return {
      id: doc._id,
      username: doc.username,
    };
  }
}
