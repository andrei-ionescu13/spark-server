import { DeveloperRepo } from '../../developerRepo';
import { DeveloperModel } from '../../model';
import { SearchArticleCategoriesController } from './searchDevelopersController';
import { SearchArticleCategoriesUseCase } from './searchDevelopersUseCase';

const developerRepo = new DeveloperRepo(DeveloperModel);
const searchArticleCategoriesUseCase = new SearchArticleCategoriesUseCase(developerRepo);
export const searchArticleCategoriesController = new SearchArticleCategoriesController(
  searchArticleCategoriesUseCase,
);
