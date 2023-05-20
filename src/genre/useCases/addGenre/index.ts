import { GenreRepo } from '../../genreRepo';
import { GenreModel } from '../../model';
import { AddGenreController } from './addGenreController';
import { AddGenreUseCase } from './addGenreUseCase';

const genreRepo = new GenreRepo(GenreModel);
const addGenreUseCase = new AddGenreUseCase(genreRepo);
export const addGenreController = new AddGenreController(addGenreUseCase);
