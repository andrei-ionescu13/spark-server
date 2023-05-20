import { GenreRepo } from '../../genreRepo';
import { GenreModel } from '../../model';
import { SearchGenresController } from './searchGenresController';
import { SearchGenresUseCase } from './searchGenresUseCase';

const genreRepo = new GenreRepo(GenreModel);
const searchGenresUseCase = new SearchGenresUseCase(genreRepo);
export const searchGenresController = new SearchGenresController(searchGenresUseCase);
