import { FeatureRepo } from '../../featureRepo';
import { FeatureModel } from '../../model';
import { CreateFeatureController } from './createFeatureController';
import { CreateFeatureUseCase } from './createFeatureUseCase';

const featureRepo = new FeatureRepo(FeatureModel);
const createFeatureUseCase = new CreateFeatureUseCase(featureRepo);
export const createFeatureController = new CreateFeatureController(createFeatureUseCase);
