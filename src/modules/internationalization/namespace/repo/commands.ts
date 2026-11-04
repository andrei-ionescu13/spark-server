import { Collection } from 'mongodb';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { Result } from '../../../../results';
import { NamespaceDoc } from '../model';
import { Namespace } from '../domain/namespace';
import { NamespaceMapper } from '../namespaceMapper';

export interface NamespaceCommandsRepoI {
  save: (namespace: Namespace) => Promise<void>;
  getNamespace: (id: string, props?: Record<string, string>) => Promise<Namespace | null>;
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

  getNamespace = async (id: string, props = {}): Promise<Namespace | null> => {
    const doc = await this.collection.findOne({ _id: id, ...props });
    if (!doc) return null;

    const namespace = NamespaceMapper.toDomain(doc);
    return namespace;
  };

  deleteNamespace = async (id: string): Promise<void> => {
    await this.collection.deleteOne({ _id: id });
  };
}
