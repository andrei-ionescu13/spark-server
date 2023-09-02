import { FeatureRepo } from '../../featureRepo';
import { FeatureModel } from '../../model';
import { UpdateFeatureController } from './updateFeatureController';
import { UpdateFeatureUseCase } from './updateFeatureUseCase';

const featureRepo = new FeatureRepo(FeatureModel);
const updateFeatureUseCase = new UpdateFeatureUseCase(featureRepo);
export const updateFeatureController = new UpdateFeatureController(updateFeatureUseCase);
