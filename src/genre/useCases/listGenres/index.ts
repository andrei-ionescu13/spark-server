import { GenreRepo } from '../../genreRepo';
import { GenreModel } from '../../model';
import { ListGenresController } from './listGenresController';
import { ListGenresUseCase } from './listGenresUseCase';

const genreRepo = new GenreRepo(GenreModel);
const listGenresUseCase = new ListGenresUseCase(genreRepo);
export const listGenresController = new ListGenresController(listGenresUseCase);
