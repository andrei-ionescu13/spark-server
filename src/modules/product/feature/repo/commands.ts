import { Collection } from 'mongodb';
import { Result } from '../../../../Result';
import { DomainValidationError } from '../../../blog/article/status';
import { Feature } from '../feature';
import { FeatureMapper } from '../featureMapper';
import { FeatureDoc } from '../model';

export interface FeatureCommandsRepoI {
  save: (feature: Feature) => Promise<void>;
  deleteFeature: (id: string) => Promise<void>;
  getFeature: (id: string) => Promise<Result<Feature | null, DomainValidationError>>;
}

export class FeatureCommandsRepo implements FeatureCommandsRepoI {
  constructor(private collection: Collection<FeatureDoc>) {}

  save = async (feature: Feature): Promise<void> => {
    const persistence = FeatureMapper.toPersistance(feature);

    await this.collection.updateOne({ _id: feature._id }, { $set: persistence }, { upsert: true });
  };

  getFeature = async (id: string): Promise<Result<Feature | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const featureOrError = FeatureMapper.toDomain(doc);
    if (featureOrError.isErr()) {
      return Result.fail(new DomainValidationError(featureOrError.error.message));
    }

    const feature = featureOrError.value;
    return Result.ok(feature);
  };

  deleteFeature = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
