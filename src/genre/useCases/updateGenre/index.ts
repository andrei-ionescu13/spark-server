import { GenreRepo } from '../../genreRepo';
import { GenreModel } from '../../model';
import { UpdateGenreController } from './updateGenreController';
import { UpdateGenreUseCase } from './updateGenreUseCase';

const genreRepo = new GenreRepo(GenreModel);
const updateGenreUseCase = new UpdateGenreUseCase(genreRepo);
export const updateGenreController = new UpdateGenreController(updateGenreUseCase);
