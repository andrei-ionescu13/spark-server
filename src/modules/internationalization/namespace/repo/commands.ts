import { Collection } from 'mongodb';
import { DomainValidationError } from '../../../blog/article/status';
import { Result } from '../../../../Result';
import { NamespaceDoc } from '../model';
import { Namespace } from '../namespace';
import { NamespaceMapper } from '../namespaceMapper';

export interface NamespaceCommandsRepoI {
  save: (namespace: Namespace) => Promise<void>;
  getNamespace: (
    id: string,
    props?: Record<string, string>,
  ) => Promise<Result<Namespace | null, DomainValidationError>>;
  deleteNamespace: (id: string) => Promise<void>;
}

export class NamespaceCommandsRepo implements NamespaceCommandsRepoI {
  constructor(private collection: Collection<NamespaceDoc>) {}

  save = async (namespace: Namespace): Promise<void> => {
    const persistence = NamespaceMapper.toPersistance(namespace);
    await this.collection.updateOne(
      { _id: namespace._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getNamespace = async (
    id: string,
    props = {},
  ): Promise<Result<Namespace | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id, ...props });
    if (!doc) return Result.ok(null);

    const namespaceOrError = NamespaceMapper.toDomain(doc);
    if (namespaceOrError.isErr()) {
      return Result.fail(new DomainValidationError(namespaceOrError.error.message));
    }

    const namespace = namespaceOrError.value;
    return Result.ok(namespace);
  };

  deleteNamespace = async (id: string): Promise<void> => {
    await this.collection.deleteOne({ _id: id });
  };
}
