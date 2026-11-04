import { Collection } from 'mongodb';
import { Result } from '../../../../results';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { Feature } from '../domain/feature';
import { FeatureMapper } from '../featureMapper';
import { FeatureDoc } from '../model';

export interface FeatureCommandsRepoI {
  save: (feature: Feature) => Promise<void>;
  deleteFeature: (id: string) => Promise<void>;
  getFeature: (id: string) => Promise<Feature | null>;
}

export class FeatureCommandsRepo implements FeatureCommandsRepoI {
  constructor(private collection: Collection<FeatureDoc>) {}

  save = async (feature: Feature): Promise<void> => {
    const persistence = FeatureMapper.toPersistance(feature);

    await this.collection.updateOne({ _id: feature._id }, { $set: persistence }, { upsert: true });
  };

  getFeature = async (id: string): Promise<Feature | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const feature = FeatureMapper.toDomain(doc);
    return feature;
  };

  deleteFeature = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
