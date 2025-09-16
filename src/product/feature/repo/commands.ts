import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Result } from '../../../Result';
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
  constructor(private featureModel: Model<FeatureDoc>) {}

  save = async (feature: Feature): Promise<void> => {
    const persistence = FeatureMapper.toPersistance(feature);

    await this.featureModel.updateOne(
      { _id: feature._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getFeature = async (id: string): Promise<Result<Feature | null, DomainValidationError>> => {
    const doc = await this.featureModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return Result.ok(null);

    const featureOrError = FeatureMapper.toDomain(doc);
    if (featureOrError.isErr()) {
      return Result.fail(new DomainValidationError(featureOrError.error.message));
    }

    const feature = featureOrError.value;
    return Result.ok(feature);
  };

  deleteFeature = async (id: string) => {
    await this.featureModel.deleteOne({ _id: id });
  };
}
