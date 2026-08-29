import { MappingValidationError } from '../blog/article/status';
import { Mapper } from '../blog/mapper';
import { Result } from '../../Result';
import { Admin } from './admin';
import { AdminUsername } from './adminUsername';
import { AdminDoc } from './model';

export interface AdminDto {
  id: string;
  username: string;
}

export class AdminMapper {
  static toDomain(doc: AdminDoc): Result<Admin, MappingValidationError> {
    console.log(doc);
    const usernameOrError = AdminUsername.create(doc.username);
    if (usernameOrError.isErr()) {
      return Result.fail(new MappingValidationError(usernameOrError.error.message));
    }

    const username = usernameOrError.value;

    return Result.ok(
      new Admin({
        username,
        _id: doc._id,
        passwordHash: doc.passwordHash,
      }),
    );
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
